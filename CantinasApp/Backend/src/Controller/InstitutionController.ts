import { Request, Response } from "express";
import { InstitutionService } from "../Service/InstitutionService";

export class InstitutionController {
  static async createInstitution(req: Request, res: Response) {
    try {
      const { name, idmenutype, location, freguesia, municipio } = req.body;

      if (!name || !idmenutype || !location) {
        return res.status(400).json({ message: "Nome, idmenutype e localização são obrigatórios." });
      }

      if (typeof idmenutype !== "number" || idmenutype <= 0) {
        return res.status(400).json({ message: "idmenutype deve ser um número positivo válido." });
      }

      const institution = await InstitutionService.createInstitution({
        name,
        idmenutype,
        location,
        freguesia,
        municipio,
      });

      return res.status(201).json({
        message: "Instituição criada com sucesso.",
        institution,
      });
    } catch (error: any) {
      if (error.message === "MENU_TYPE_NOT_FOUND") {
        return res.status(404).json({ message: "MenuType não encontrado." });
      }
      return res.status(500).json({
        message: "Erro ao criar instituição.",
        error: error.message,
      });
    }
  }

  static async getAllInstitutions(req: Request, res: Response) {
    try {
      const institutions = await InstitutionService.getAllInstitutions();
      return res.status(200).json(institutions);
    } catch (error: any) {
      return res.status(500).json({
        message: "Erro ao buscar instituições.",
        error: error.message,
      });
    }
  }

  static async getInstitutionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const institution = await InstitutionService.getInstitutionById(Number(id));
      return res.status(200).json(institution);
    } catch (error: any) {
      if (error.message === "INSTITUTION_NOT_FOUND") {
        return res.status(404).json({ message: "Instituição não encontrada." });
      }
      return res.status(500).json({
        message: "Erro ao buscar instituição.",
        error: error.message,
      });
    }
  }
}

