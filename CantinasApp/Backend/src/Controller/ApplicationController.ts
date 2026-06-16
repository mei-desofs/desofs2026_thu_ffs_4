import { Request, Response } from "express";
import { ApplicationService } from "../Service/ApplicationService";
import Joi from "joi";
import fs from "fs";
import path from "path";
import { safeFilename } from "../utils/fileUtils";

type AuthenticatedUser = {
  id: number;
  role: string;
};

const getAuthenticatedUser = (req: Request): AuthenticatedUser | undefined =>
  (req as Request & { user?: AuthenticatedUser }).user;

const canManageApplications = (role: string) => role === "NetworkManager";

const service = new ApplicationService();

const productSchema = Joi.object({
  productId: Joi.number().integer().required(),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().required(),
});

const applicationSchema = Joi.object({
  userId: Joi.number().integer().required(),
  applicationDate: Joi.date().optional(),
  status: Joi.string().optional(),
  businessEmail: Joi.string().email().required(),
  businessPhone: Joi.string().required(),
  supplierComment: Joi.string().optional(),
  name: Joi.string().required(),
  location: Joi.string().required(),
  freguesia: Joi.string().required(),
  municipio: Joi.string().required(),
  evaluationComment: Joi.string().optional(),
  documentsSubmitted: Joi.array()
    .items(
      Joi.object({
        filename: Joi.string().required(),
        path: Joi.string().required(),
      }),
    )
    .optional(),
  farmerProducts: Joi.array()
    .items(
      Joi.object({
        week: Joi.number().integer().required(),
        products: Joi.array().items(productSchema).required(),
      }),
    )
    .required(),
});

export class ApplicationController {
  static async createApplication(req: Request, res: Response) {
    const { error } = applicationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    try {
      const app = await service.createApplication(req.body);
      res.json(app);
    } catch (error: any) {
      if (error.message === "APPLICATION_ALREADY_EXISTS")
        return res
          .status(409)
          .json({ error: "User already has an application" });
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getApplicationByUser(req: Request, res: Response) {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid userId" });

    const authenticatedUser = getAuthenticatedUser(req);
    if (!authenticatedUser) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    if (
      !canManageApplications(authenticatedUser.role) &&
      authenticatedUser.id !== userId
    ) {
      return res
        .status(403)
        .json({ error: "Sem permissão para aceder a esta aplicação" });
    }

    try {
      const app = await service.getApplicationByUser(userId);
      res.json(app);
    } catch (error: any) {
      if (error.message === "APPLICATION_NOT_FOUND")
        return res.status(404).json({ error: "Application not found" });
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async listApplications(req: Request, res: Response) {
    const authenticatedUser = getAuthenticatedUser(req);
    if (!authenticatedUser || !canManageApplications(authenticatedUser.role)) {
      return res
        .status(403)
        .json({ error: "Sem permissão para aceder às aplicações" });
    }

    const apps = await service.listApplications();
    res.json(apps);
  }

  static async getDocument(req: Request, res: Response) {
    const applicationId: number = Number(req.params.applicationId);
    if (isNaN(applicationId)) {
      return res.status(400).json({ error: "Invalid applicationId" });
    }
    const filenameParam = req.params.filename;
    const filename: string = Array.isArray(filenameParam)
      ? filenameParam[0]
      : filenameParam;
    if (filename == null || filename.length == 0) {
      return res.status(400).json({ error: "Invalid filename" });
    }

    const authenticatedUser = getAuthenticatedUser(req);
    if (!authenticatedUser) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const app = await service
      .getApplicationById(applicationId)
      .catch(() => null);
    if (
      app &&
      !canManageApplications(authenticatedUser.role) &&
      app.userId !== authenticatedUser.id
    ) {
      return res
        .status(403)
        .json({ error: "Sem permissão para aceder a este documento" });
    }

    const filePath: string =
      await service.getFilePathByApplicationIdAndFileName(
        applicationId,
        filename,
      );
    return res.sendFile(filePath);
  }

  static async updateApplication(req: Request, res: Response) {
    const applicationId = Number(req.params.applicationId);
    if (isNaN(applicationId))
      return res.status(400).json({ error: "Invalid applicationId" });
    const { error } = applicationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const authenticatedUser = getAuthenticatedUser(req);
    if (!authenticatedUser) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    try {
      const existingApp = await service
        .getApplicationByUser(Number(req.body.userId))
        .catch(() => null);
      if (
        existingApp &&
        !canManageApplications(authenticatedUser.role) &&
        existingApp.userId !== authenticatedUser.id
      ) {
        return res
          .status(403)
          .json({ error: "Sem permissão para atualizar esta aplicação" });
      }

      if (!canManageApplications(authenticatedUser.role)) {
        req.body.status = existingApp?.status;
        req.body.evaluationComment = existingApp?.evaluationComment;
      }

      const updatedApp = await service.updateApplication(
        applicationId,
        req.body,
      );
      res.json(updatedApp);
    } catch (err: any) {
      if (err.message === "APPLICATION_NOT_FOUND")
        return res.status(404).json({ error: "Application not found" });
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async acceptApplication(req: Request, res: Response) {
    const applicationId = Number(req.params.applicationId);
    if (isNaN(applicationId))
      return res.status(400).json({ error: "Invalid applicationId" });
    const authenticatedUser = getAuthenticatedUser(req);
    if (!authenticatedUser || !canManageApplications(authenticatedUser.role)) {
      return res
        .status(403)
        .json({ error: "Sem permissão para aceitar aplicações" });
    }
    try {
      const updatedApp = await service.acceptApplication(
        applicationId,
        req.body.evaluationComment,
      );
      res.json(updatedApp);
    } catch (err: any) {
      if (err.message === "APPLICATION_NOT_FOUND")
        return res.status(404).json({ error: "Application not found" });
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async rejectApplication(req: Request, res: Response) {
    const applicationId = Number(req.params.applicationId);
    if (isNaN(applicationId))
      return res.status(400).json({ error: "Invalid applicationId" });
    const authenticatedUser = getAuthenticatedUser(req);
    if (!authenticatedUser || !canManageApplications(authenticatedUser.role)) {
      return res
        .status(403)
        .json({ error: "Sem permissão para rejeitar aplicações" });
    }
    try {
      const updatedApp = await service.rejectApplication(
        applicationId,
        req.body.evaluationComment,
      );
      res.json(updatedApp);
    } catch (err: any) {
      if (err.message === "APPLICATION_NOT_FOUND")
        return res.status(404).json({ error: "Application not found" });
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async createApplicationWithFiles(req: Request, res: Response) {
    try {
      const authenticatedUser = getAuthenticatedUser(req);
      if (!authenticatedUser) {
        return res.status(401).json({ error: "Não autenticado" });
      }

      const {
        businessEmail,
        businessPhone,
        name,
        location,
        freguesia,
        municipio,
        supplierComment,
        farmerProducts,
      } = req.body;

      const files = (req.files as Express.Multer.File[]) || [];

      const fileMaxSize = 5; //In MB
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain'];

      if (files.length > 10) return res.status(500).json({ error: "Cannot upload more than 10 files." });
      if (files.some((f) => f.size > fileMaxSize * 1024 * 1024)) return res.status(500).json({ error: "Cannot upload file with more than " + fileMaxSize + " MB." });
      if (files.some((f) => allowedMimeTypes.includes(f.mimetype))) return res.status(500).json({ error: "Used only approved file extensions." });

      // Criar aplicação **primeiro** sem ficheiros
      const app = await service.createApplication({
        userId: authenticatedUser.id,
        businessEmail,
        businessPhone,
        name,
        location,
        freguesia,
        municipio,
        supplierComment,
        documentsSubmitted: [], // 🔹 inicializar vazio
        farmerProducts: JSON.parse(farmerProducts),
      });

      if (!app)
        return res.status(500).json({ error: "Failed to create application" });
      const applicationId = app.id;

      const uploadsDir = path.resolve("uploads");
      const documents = files.map((f) => {
        const newFilename = `${authenticatedUser.id}-${applicationId}-${safeFilename(f.originalname)}`;
        const resolvedPath = path.resolve(uploadsDir, newFilename);

        if (!resolvedPath.startsWith(uploadsDir + path.sep)) {
          throw new Error("INVALID_FILE_PATH");
        }

        fs.renameSync(f.path, resolvedPath);

        return { filename: f.originalname, path: path.join("uploads", newFilename) };
      });

      // Atualizar aplicação com documentos
      const updatedApp = await service.updateApplication(applicationId, {
        documentsSubmitted: documents,
      });

      res.status(201).json(updatedApp);
    } catch (error: any) {
      console.error(error);
      if (error.message === "APPLICATION_ALREADY_EXISTS")
        return res
          .status(409)
          .json({ error: "User already has an application" });
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateApplicationWithFiles(req: Request, res: Response) {
    try {
      const applicationId = Number(req.params.applicationId);
      if (isNaN(applicationId))
        return res.status(400).json({ error: "Invalid applicationId" });

      const authenticatedUser = getAuthenticatedUser(req);
      if (!authenticatedUser) {
        return res.status(401).json({ error: "Não autenticado" });
      }

      // Buscar aplicação existente
      const existingApp = await service.getApplicationByUser(
        authenticatedUser.id,
      );

      if (
        !canManageApplications(authenticatedUser.role) &&
        existingApp.userId !== authenticatedUser.id
      ) {
        return res
          .status(403)
          .json({ error: "Sem permissão para atualizar esta aplicação" });
      }

      const files = (req.files as Express.Multer.File[]) || [];
      const uploadsDir2 = path.resolve("uploads");
      const newDocuments = files.map((f) => {
        const newFilename = `${existingApp.userId}-${applicationId}-${safeFilename(f.originalname)}`;
        const resolvedPath2 = path.resolve(uploadsDir2, newFilename);

        if (!resolvedPath2.startsWith(uploadsDir2 + path.sep)) {
          throw new Error("INVALID_FILE_PATH");
        }

        fs.renameSync(f.path, resolvedPath2);
        return { filename: f.originalname, path: path.join("uploads", newFilename) };
      });

      const documentsSubmitted = existingApp.documentsSubmitted
        ? [...existingApp.documentsSubmitted, ...newDocuments]
        : newDocuments;

      const bodyData = {
        ...req.body,
        userId: authenticatedUser.id,
        farmerProducts: JSON.parse(req.body.farmerProducts),
        documentsSubmitted,
      };

      if (!canManageApplications(authenticatedUser.role)) {
        bodyData.status = "submitted";
        bodyData.evaluationComment = undefined;
      }

      const { error } = applicationSchema.validate(bodyData);
      if (error) return res.status(400).json({ error: error.message });

      const updatedApp = await service.updateApplication(
        applicationId,
        bodyData,
      );
      res.json(updatedApp);
    } catch (error: any) {
      console.error(error);
      if (error.message === "APPLICATION_NOT_FOUND")
        return res.status(404).json({ error: "Application not found" });
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
