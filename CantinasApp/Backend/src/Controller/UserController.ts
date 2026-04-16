import { Request, Response } from "express";
import { UserService } from "../Service/UserService";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "minha_chave_secreta";

export class UserController {
  static async register(req: Request, res: Response) {
    const { name, email, password, role, refeitorioId, canteenId } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    // Validar refeitorioId se o role for RefectoryManager
    if (role === "RefectoryManager" && !refeitorioId) {
      return res.status(400).json({ message: "refeitorioId é obrigatório para RefectoryManager." });
    }

    // Validar canteenId se o role for CanteenManager
    if (role === "CanteenManager" && !canteenId) {
      return res.status(400).json({ message: "canteenId é obrigatório para CanteenManager." });
    }
    
    // Validar refeitorioId se o role for RefectoryManager ou RefectoryStaff
    if ((role === "RefectoryManager" || role === "RefectoryStaff") && !refeitorioId) {
      return res.status(400).json({ message: "refeitorioId é obrigatório para RefectoryManager e RefectoryStaff." });
    }

    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email já registado." });
    }

    try {
      const user = await UserService.createUser(name, email, password, role, refeitorioId, canteenId);
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
      return res.status(500).json({ message: "Erro ao criar utilizador.", error: err });
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

      res.json({
        message: "Login bem-sucedido",
        user,
        token,
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Erro ao fazer login" });
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
      return res.status(200).json({ message: "Quarentena iniciada com sucesso.", user });
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
      return res.status(200).json({ message: "Quarentena iniciada com sucesso.", user });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
