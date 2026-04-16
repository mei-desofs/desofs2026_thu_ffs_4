import { Request, Response } from "express";
import { RefeitorioService } from "../Service/RefeitorioService";

export class RefeitorioController {
  static async createRefeitorio(req: Request, res: Response) {
    try {
      const { name, institutionId, location, freguesia, municipio } = req.body;

      if (!name || !location) {
        return res.status(400).json({ message: "Nome e localização são obrigatórios." });
      }

      const refeitorio = await RefeitorioService.createRefeitorio({
        name,
        institutionId,
        location,
        freguesia,
        municipio,
      });

      return res.status(201).json({
        message: "Refeitório criado com sucesso.",
        refeitorio,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Erro ao criar refeitório.",
        error: error.message,
      });
    }
  }

  static async getAllRefeitorios(req: Request, res: Response) {
    try {
      const refeitorios = await RefeitorioService.getAllRefeitorios();
      return res.status(200).json(refeitorios);
    } catch (error: any) {
      return res.status(500).json({
        message: "Erro ao buscar refeitórios.",
        error: error.message,
      });
    }
  }

  static async getRefeitorioById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const refeitorio = await RefeitorioService.getRefeitorioById(Number(id));
      return res.status(200).json(refeitorio);
    } catch (error: any) {
      if (error.message === "REFEITORIO_NOT_FOUND") {
        return res.status(404).json({ message: "Refeitório não encontrado." });
      }
      return res.status(500).json({
        message: "Erro ao buscar refeitório.",
        error: error.message,
      });
    }
  }
}

