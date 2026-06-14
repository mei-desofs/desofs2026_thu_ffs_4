import { User } from "../Model/User";
import { Canteen } from "../Model/Canteen";
import { Refeitorio } from "../Model/Refeitorio";
import { LoginAudit } from "../Model/LoginAudit";
import bcrypt from "bcrypt";
import { OrderService } from "./OrderService";
import { NeededProduct } from "../Model/NeededProduct";
import { generateOrdersFromNeededProducts } from "../utils/generateOrdersFromNeededProducts";
import { assertPasswordPolicyAsync } from "../utils/passwordPolicy";
import { generateSecureToken, getTokenExpiry } from "../utils/tokenGenerator";
import { NotificationService } from "./NotificationService";
import { SessionService } from "./SessionService";

export class UserService {
  // Criar novo utilizador
  static async createUser(
    name: string,
    email: string,
    password: string,
    role:
      | "Supplier"
      | "NetworkManager"
      | "Nutritionist"
      | "Student"
      | "Visitor"
      | "NursingHome"
      | "RefectoryStaff"
      | "StockManager"
      | "CanteenManager"
      | "RefectoryManager",
    refeitorioId?: number,
    canteenId?: number,
  ) {
    await assertPasswordPolicyAsync(password, { name, email, role });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      status: "enabled",
      refeitorioId,
      canteenId,
    });
    return user;
  }

  // Verificar se email existe
  static async findByEmail(email: string) {
    return await User.findOne({ where: { email } });
  }

  // Login
  static async login(
    email: string,
    password: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Canteen,
          as: "canteen",
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: Refeitorio,
          as: "refeitorio",
          attributes: ["id", "name"],
          required: false,
        },
      ],
    });

    if (!user || (user as any).status === "disabled") {
      throw new Error("Credenciais inválidas.");
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password as string,
    );
    if (!validPassword) {
      if (user) {
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
        await user.save();

        if ((user.failedLoginAttempts || 0) >= 3) {
          await NotificationService.create(
            user.id,
            "Muitas tentativas de autenticação",
            `Foram registadas ${user.failedLoginAttempts} tentativas falhadas na sua conta${ipAddress ? ` a partir de ${ipAddress}` : ""}.`,
          );
        }
      }

      throw new Error("Credenciais inválidas.");
    }

    const previousIp = user.lastLoginIp;
    user.failedLoginAttempts = 0;
    user.lastLoginAt = new Date();
    user.lastLoginIp = ipAddress || user.lastLoginIp || null;
    await user.save();

    if (previousIp && ipAddress && previousIp !== ipAddress) {
      await NotificationService.create(
        user.id,
        "Novo início de sessão detetado",
        `Foi feito um login a partir de um novo endereço IP (${ipAddress}). Se não foi você, altere a sua password imediatamente.`,
      );
    }

    // Retorna dados do user sem password, incluindo informações da cantina/refeitório
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: (user as any).role || "user",
      status: (user as any).status || "enabled",
      canteenId: (user as any).canteenId || null,
      refeitorioId: (user as any).refeitorioId || null,
      canteen: (user as any).canteen
        ? { id: (user as any).canteen.id, name: (user as any).canteen.name }
        : null,
      refeitorio: (user as any).refeitorio
        ? {
            id: (user as any).refeitorio.id,
            name: (user as any).refeitorio.name,
          }
        : null,
    };
  }

  static async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
    options: {
      terminateOtherSessions?: boolean;
      currentSessionId?: string;
    } = {},
  ) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("Utilizador não encontrado.");
    }

    const currentPasswordIsValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!currentPasswordIsValid) {
      throw new Error("Credenciais inválidas.");
    }

    await assertPasswordPolicyAsync(newPassword, {
      name: user.name,
      email: user.email,
      role: user.role,
    });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    if (options.terminateOtherSessions && options.currentSessionId) {
      await SessionService.terminateOtherSessionsForUser(
        user.id,
        options.currentSessionId,
        "As outras sessões foram terminadas após alteração de password.",
      );
    }

    await NotificationService.create(
      user.id,
      "Password atualizada",
      "A password da sua conta foi alterada com sucesso.",
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      refeitorioId: user.refeitorioId ?? null,
      canteenId: user.canteenId ?? null,
    };
  }

  // Encontrar utilizador por ID
  static async findById(id: number) {
    return await User.findByPk(id, {
      attributes: { exclude: ["password"] }, // Excluir password dos resultados
    });
  }

  static async startQuarantine(id: number) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("Utilizador não encontrado.");
    }
    user.status = "quarantine";
    await user.save();

    await SessionService.terminateAllSessionsForUser(
      user.id,
      "Conta colocada em quarentena.",
    );

    if (user.role === "Supplier") {
      // se o supplier tiver orders, cancelear e meter neededProducts como needed outra vez
      const orders = await OrderService.getByUserId(id);
      const needProductsIds = [];
      for (const order of orders) {
        await OrderService.updateStatus(order.id, "cancelled");
        needProductsIds.push(order.neededProductId);
      }

      for (const npId of needProductsIds) {
        const neededProduct = await NeededProduct.findByPk(npId);
        if (neededProduct) {
          neededProduct.status = "needed";
          await neededProduct.save();
        }
      }

      // gerar novas encomendas dos neededProducts atualizados para outros suppliers
      await generateOrdersFromNeededProducts();
    }

    return user;
  }

  static async endQuarantine(id: number) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("Utilizador não encontrado.");
    }
    user.status = "enabled";
    await user.save();
    return user;
  }

  static async listActiveSessions(userId: number) {
    return SessionService.listActiveSessionsForUser(userId);
  }

  static async logout(sessionId?: string) {
    return SessionService.terminateCurrentSession(
      sessionId,
      "Logout do utilizador.",
    );
  }

  static async terminateSession(userId: number, sessionId: string) {
    return SessionService.terminateSessionForUser(userId, sessionId);
  }

  static async terminateOtherSessions(
    userId: number,
    currentSessionId: string,
  ) {
    return SessionService.terminateOtherSessionsForUser(
      userId,
      currentSessionId,
      "Outras sessões terminadas pelo utilizador.",
    );
  }

  static async terminateAllSessions(userId: number) {
    return SessionService.terminateAllSessionsForUser(
      userId,
      "Todas as sessões foram terminadas.",
    );
  }

  static async terminateAllSessionsGlobally() {
    await SessionService.terminateAllSessionsGlobally(
      "Todas as sessões foram terminadas por um administrador.",
    );
  }

  static async logLoginAttempt(
    email: string,
    ipAddress: string,
    userAgent: string | undefined,
    status: "success" | "failed" | "blocked",
    reason?: string,
  ) {
    const user = await User.findOne({ where: { email } });
    await LoginAudit.create({
      userId: user?.id,
      email,
      ipAddress,
      userAgent,
      status,
      reason,
    });
  }

  static async verifyEmail(token: string) {
    const user = await User.findOne({
      where: {
        emailVerificationToken: token,
      },
    });

    if (!user) {
      throw new Error("Token inválido.");
    }

    if (
      user.emailVerificationExpiry &&
      new Date() > user.emailVerificationExpiry
    ) {
      throw new Error("Token expirado.");
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiry = null;
    await user.save();

    await NotificationService.create(
      user.id,
      "Email verificado",
      "O seu email foi verificado com sucesso.",
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  static async requestPasswordReset(email: string) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Don't leak whether email exists
      return {
        message: "Se a conta existe, receberá um email com instruções.",
      };
    }

    const resetToken = generateSecureToken();
    const resetExpiry = getTokenExpiry(60); // 60 minutes

    user.passwordResetToken = resetToken;
    user.passwordResetExpiry = resetExpiry;
    await user.save();

    await NotificationService.create(
      user.id,
      "Pedido de reposição de password",
      "Foi iniciado um pedido de reposição de password na sua conta.",
    );

    return {
      message: "Email de reset enviado.",
      token: resetToken,
      expiry: resetExpiry,
    };
  }

  static async resetPassword(token: string, newPassword: string) {
    const user = await User.findOne({
      where: {
        passwordResetToken: token,
      },
    });

    if (!user) {
      throw new Error("Token inválido.");
    }

    if (user.passwordResetExpiry && new Date() > user.passwordResetExpiry) {
      throw new Error("Token expirado.");
    }

    await assertPasswordPolicyAsync(newPassword, {
      name: user.name,
      email: user.email,
      role: user.role,
    });

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpiry = null;
    await user.save();

    await SessionService.terminateAllSessionsForUser(
      user.id,
      "Password redefinida.",
    );

    await NotificationService.create(
      user.id,
      "Password redefinida",
      "A password da sua conta foi redefinida com sucesso.",
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  static async adminInitiatePasswordReset(userId: number) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("Utilizador não encontrado.");
    }

    const resetToken = generateSecureToken();
    const resetExpiry = getTokenExpiry(60);

    user.passwordResetToken = resetToken;
    user.passwordResetExpiry = resetExpiry;
    await user.save();

    await NotificationService.create(
      user.id,
      "Reposição de password iniciada por administrador",
      "Um administrador iniciou o processo de reposição de password para a sua conta.",
    );

    return {
      message: "Processo de reposição de password iniciado com sucesso.",
      token: resetToken,
      expiry: resetExpiry,
    };
  }
}
