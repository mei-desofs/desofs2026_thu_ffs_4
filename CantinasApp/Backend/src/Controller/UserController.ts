import { Request, Response } from "express";
import { UserService } from "../Service/UserService";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../Config/auth";
import {
  changePasswordSchema,
  registerUserSchema,
  verifyEmailSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from "../Schemas/UserValidation";

const getClientIp = (req: Request): string => {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    (req.socket?.remoteAddress as string) ||
    "unknown"
  );
};

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

    // Validar refeitorioId se o role for RefectoryManager
    if (role === "RefectoryManager" && !refeitorioId) {
      return res
        .status(400)
        .json({ message: "refeitorioId é obrigatório para RefectoryManager." });
    }

    // Validar canteenId se o role for CanteenManager
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

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: "1d",
      });

      // Log successful login
      await UserService.logLoginAttempt(email, ipAddress, userAgent, "success");

      res.json({
        message: "Login bem-sucedido",
        user,
        token,
      });
    } catch (err: any) {
      const { email } = req.body;
      const ipAddress = getClientIp(req);
      const userAgent = req.headers["user-agent"];

      // Log failed login
      await UserService.logLoginAttempt(
        email,
        ipAddress,
        userAgent,
        "failed",
        err.message,
      );

      res
        .status(400)
        .json({ message: err.message || "Credenciais inválidas." });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const { error } = changePasswordSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        return res.status(400).json({
          message: error.details.map((detail) => detail.message).join(" "),
        });
      }

      const authenticatedUser = (req as any).user;
      const updatedUser = await UserService.changePassword(
        authenticatedUser.id,
        currentPassword,
        newPassword,
      );

      return res.status(200).json({
        message: "Password atualizada com sucesso.",
        user: updatedUser,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Não foi possível alterar a password.",
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
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
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
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
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
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
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
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Não foi possível verificar o email.",
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
    } catch (error: any) {
      return res.status(500).json({
        message:
          error.message || "Não foi possível processar o pedido de reset.",
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
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Não foi possível alterar a password.",
      });
    }
  }

  static async adminInitiatePasswordReset(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await UserService.adminInitiatePasswordReset(Number(id));
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(404).json({
        message: error.message || "Não foi possível iniciar a reposição.",
      });
    }
  }
}
