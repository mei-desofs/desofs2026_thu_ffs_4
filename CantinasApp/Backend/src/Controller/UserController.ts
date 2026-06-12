import { Request, Response } from "express";
import { UserService } from "../Service/UserService";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";

const rawJwtSecret = process.env.JWT_SECRET;
if (!rawJwtSecret) {
  throw new Error("JWT_SECRET não definido no .env");
}
const SECRET_KEY: string = rawJwtSecret;

export class UserController {
  static async register(req: Request, res: Response) {
    const { name, email, password, role, refeitorioId, canteenId } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    if (role === "RefectoryManager" && !refeitorioId) {
      return res.status(400).json({ message: "refeitorioId é obrigatório para RefectoryManager." });
    }

    if (role === "CanteenManager" && !canteenId) {
      return res.status(400).json({ message: "canteenId é obrigatório para CanteenManager." });
    }

    if ((role === "RefectoryManager" || role === "RefectoryStaff") && !refeitorioId) {
      return res.status(400).json({ message: "refeitorioId é obrigatório para RefectoryManager e RefectoryStaff." });
    }

    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email já registado." });
    }

    try {
      const user = await UserService.createUser(name, email, password, role, refeitorioId, canteenId);
      logger.info({ event: "user_registered", userId: user.id, role: user.role });
      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        refeitorioId: user.refeitorioId,
        canteenId: user.canteenId
      });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao criar utilizador." });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await UserService.login(email, password);

      const token = jwt.sign(
        { id: user.id, role: user.role },
        SECRET_KEY,
        { expiresIn: "1d" }
      );

      logger.info({ event: "login_success", userId: user.id, role: user.role });

      res.json({
        message: "Login bem-sucedido",
        user,
        token,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao fazer login";
      logger.warn({ event: "login_failed", email: req.body?.email, reason: message });
      res.status(400).json({ message });
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
      const message = error instanceof Error ? error.message : "Erro interno";
      return res.status(500).json({ message });
    }
  }

  static async startQuarantine(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.startQuarantine(Number(id));
      if (!user) {
        return res.status(404).json({ message: "Utilizador não encontrado." });
      }
      logger.info({ event: "quarantine_started", targetUserId: id });
      return res.status(200).json({ message: "Quarentena iniciada com sucesso.", user });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro interno";
      return res.status(500).json({ message });
    }
  }

  static async endQuarantine(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.endQuarantine(Number(id));
      if (!user) {
        return res.status(404).json({ message: "Utilizador não encontrado." });
      }
      logger.info({ event: "quarantine_ended", targetUserId: id });
      return res.status(200).json({ message: "Quarentena terminada com sucesso.", user });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro interno";
      return res.status(500).json({ message });
    }
  }
}
