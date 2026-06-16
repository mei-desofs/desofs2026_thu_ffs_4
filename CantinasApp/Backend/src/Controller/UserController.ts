import { Request, Response } from "express";
import { UserService } from "../Service/UserService";
import { SessionService } from "../Service/SessionService";
import {
  changePasswordSchema,
  registerUserSchema,
  verifyEmailSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from "../Schemas/UserValidation";

type AuthenticatedUser = {
  id: number;
  role: string;
  sessionId?: string;
};
import logger from "../utils/logger";

const getAuthenticatedUser = (req: Request): AuthenticatedUser | undefined =>
  (req as Request & { user?: AuthenticatedUser }).user;

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const getClientIp = (req: Request): string =>
  req.ip ?? "unknown";

export class UserController {
  static async register(req: Request, res: Response) {
    const { name, email, password, role, refeitorioId, canteenId } = req.body;

    const { error } = registerUserSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: error.details.map((detail) => detail.message).join(" "),
      });
    }

    if (role === "RefectoryManager" && !refeitorioId) {
      return res
        .status(400)
        .json({ message: "refeitorioId é obrigatório para RefectoryManager." });
    }

    if (role === "CanteenManager" && !canteenId) {
      return res
        .status(400)
        .json({ message: "canteenId é obrigatório para CanteenManager." });
    }

    // Validar refeitorioId se o role for RefectoryManager ou RefectoryStaff
    if (
      (role === "RefectoryManager" || role === "RefectoryStaff") &&
      !refeitorioId
    ) {
      return res.status(400).json({
        message:
          "refeitorioId é obrigatório para RefectoryManager e RefectoryStaff.",
      });
    }

    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Não foi possível concluir o registo." });
    }

    try {
      const user = await UserService.createUser(
        name,
        email,
        password,
        role,
        refeitorioId,
        canteenId,
      );
      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        refeitorioId: user.refeitorioId,
        canteenId: user.canteenId,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Erro ao criar utilizador.", error: err });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const ipAddress = getClientIp(req);
      const userAgent = req.headers["user-agent"];

      const user = await UserService.login(
        email,
        password,
        ipAddress,
        userAgent as string | undefined,
      );

      const session = await SessionService.createSession(
        user,
        ipAddress,
        userAgent as string | undefined,
      );

      // Log successful login
      await UserService.logLoginAttempt(email, ipAddress, userAgent, "success");

      logger.info({ event: "login_success", userId: user.id, role: user.role });

      res.json({
        message: "Login bem-sucedido",
        user,
        token: session.token,
        sessionId: session.sessionId,
        expiresAt: session.expiresAt,
      });
    } catch (error: unknown) {
      const { email } = req.body;
      const ipAddress = getClientIp(req);
      const userAgent = req.headers["user-agent"];
      const errorMessage = getErrorMessage(error, "Credenciais inválidas.");

      // Log failed login
      await UserService.logLoginAttempt(
        email,
        ipAddress,
        userAgent,
        "failed",
        errorMessage,
      );

      res.status(400).json({ message: errorMessage });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword, terminateOtherSessions } = req.body;
      const { error } = changePasswordSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        return res.status(400).json({
          message: error.details.map((detail) => detail.message).join(" "),
        });
      }

      const authenticatedUser = getAuthenticatedUser(req);

      if (!authenticatedUser) {
        return res.status(401).json({ message: "Não autenticado." });
      }

      const updatedUser = await UserService.changePassword(
        authenticatedUser.id,
        currentPassword,
        newPassword,
        {
          terminateOtherSessions,
          currentSessionId: authenticatedUser.sessionId,
        },
      );

      return res.status(200).json({
        message: "Password atualizada com sucesso.",
        user: updatedUser,
      });
    } catch (error: unknown) {
      return res.status(400).json({
        message: getErrorMessage(error, "Não foi possível alterar a password."),
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.findById(Number(id));
      if (!user) {
        return res.status(404).json({ message: "Utilizador não encontrado." });
      }
      return res.status(200).json(user);
    } catch (error: unknown) {
      return res.status(500).json({
        message: getErrorMessage(error, "Erro ao obter utilizador."),
      });
    }
  }

  static async startQuarantine(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.startQuarantine(Number(id));
      if (!user) {
        return res.status(404).json({ message: "Utilizador não encontrado." });
      }
      return res
        .status(200)
        .json({ message: "Quarentena iniciada com sucesso.", user });
    } catch (error: unknown) {
      return res.status(500).json({
        message: getErrorMessage(error, "Erro ao iniciar quarentena."),
      });
    }
  }

  static async endQuarantine(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.endQuarantine(Number(id));
      if (!user) {
        return res.status(404).json({ message: "Utilizador não encontrado." });
      }
      return res
        .status(200)
        .json({ message: "Quarentena iniciada com sucesso.", user });
    } catch (error: unknown) {
      return res.status(500).json({
        message: getErrorMessage(error, "Erro ao terminar quarentena."),
      });
    }
  }

  static async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const { error } = verifyEmailSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        return res.status(400).json({
          message: error.details.map((detail) => detail.message).join(" "),
        });
      }

      const user = await UserService.verifyEmail(token);
      return res.status(200).json({
        message: "Email verificado com sucesso.",
        user,
      });
    } catch (error: unknown) {
      return res.status(400).json({
        message: getErrorMessage(error, "Não foi possível verificar o email."),
      });
    }
  }

  static async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const { error } = requestPasswordResetSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        return res.status(400).json({
          message: error.details.map((detail) => detail.message).join(" "),
        });
      }

      const result = await UserService.requestPasswordReset(email);
      return res.status(200).json(result);
    } catch (error: unknown) {
      return res.status(500).json({
        message: getErrorMessage(
          error,
          "Não foi possível processar o pedido de reset.",
        ),
      });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      const { error } = resetPasswordSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        return res.status(400).json({
          message: error.details.map((detail) => detail.message).join(" "),
        });
      }

      const user = await UserService.resetPassword(token, newPassword);
      return res.status(200).json({
        message: "Password alterada com sucesso.",
        user,
      });
    } catch (error: unknown) {
      return res.status(400).json({
        message: getErrorMessage(error, "Não foi possível alterar a password."),
      });
    }
  }

  static async adminInitiatePasswordReset(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await UserService.adminInitiatePasswordReset(Number(id));
      return res.status(200).json(result);
    } catch (error: unknown) {
      return res.status(404).json({
        message: getErrorMessage(
          error,
          "Não foi possível iniciar a reposição.",
        ),
      });
    }
  }

  static async logout(req: Request, res: Response) {
    const authenticatedUser = getAuthenticatedUser(req);
    if (!authenticatedUser) {
      return res.status(401).json({ message: "Não autenticado." });
    }
    await UserService.logout(authenticatedUser?.sessionId);
    return res.status(200).json({ message: "Logout efetuado com sucesso." });
  }

  static async listMySessions(req: Request, res: Response) {
    const authenticatedUser = getAuthenticatedUser(req);
    if (!authenticatedUser) {
      return res.status(401).json({ message: "Não autenticado." });
    }
    const sessions = await UserService.listActiveSessions(authenticatedUser.id);
    return res.status(200).json({ sessions });
  }

  static async terminateMySession(req: Request, res: Response) {
    const authenticatedUser = getAuthenticatedUser(req);
    if (!authenticatedUser) {
      return res.status(401).json({ message: "Não autenticado." });
    }
    const sessionId = Array.isArray(req.params.sessionId)
      ? req.params.sessionId[0]
      : req.params.sessionId;
    await UserService.terminateSession(authenticatedUser.id, sessionId);
    return res.status(200).json({ message: "Sessão terminada com sucesso." });
  }

  static async terminateOtherMySessions(req: Request, res: Response) {
    const authenticatedUser = getAuthenticatedUser(req);
    if (!authenticatedUser) {
      return res.status(401).json({ message: "Não autenticado." });
    }
    await UserService.terminateOtherSessions(
      authenticatedUser.id,
      authenticatedUser.sessionId || "",
    );
    return res
      .status(200)
      .json({ message: "Outras sessões terminadas com sucesso." });
  }

  static async terminateAllMySessions(req: Request, res: Response) {
    const authenticatedUser = getAuthenticatedUser(req);
    if (!authenticatedUser) {
      return res.status(401).json({ message: "Não autenticado." });
    }
    await UserService.terminateAllSessions(authenticatedUser.id);
    return res
      .status(200)
      .json({ message: "Todas as sessões terminadas com sucesso." });
  }

  static async adminTerminateUserSessions(req: Request, res: Response) {
    const { id } = req.params;
    await UserService.terminateAllSessions(Number(id));
    return res
      .status(200)
      .json({ message: "Sessões do utilizador terminadas com sucesso." });
  }

  static async adminTerminateAllSessions(req: Request, res: Response) {
    await SessionService.terminateAllSessionsGlobally(
      "Todas as sessões foram terminadas por um administrador.",
    );
    return res
      .status(200)
      .json({ message: "Todas as sessões terminadas com sucesso." });
  }
}
