import { Router } from "express";
import { ApplicationController } from "../Controller/ApplicationController";
import multer from "multer";
import path from "path";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

// Configuração do multer para PDFs com nomes únicos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // pasta onde os PDFs serão guardados
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // nome único
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Apenas PDFs são permitidos!"));
    }
    cb(null, true);
  },
});

const router = Router();

// Criar nova aplicação com FarmerProducts e documentos PDF
router.post(
  "/",
  authLimiter,
  authMiddleware,
  upload.array("documents"),
  ApplicationController.createApplicationWithFiles,
);

// Atualizar uma aplicação com FarmerProducts e documentos PDF
router.put(
  "/:applicationId",
  authLimiter,
  authMiddleware,
  upload.array("documents"),
  ApplicationController.updateApplicationWithFiles,
);

// Listar todas as aplicações
router.get(
  "/",
  apiLimiter,
  authMiddleware,
  authorizeRoles("NetworkManager"),
  ApplicationController.listApplications,
);

// Get document of one application
router.get(
  "/:applicationId/documents/:filename",
  apiLimiter,
  authMiddleware,
  ApplicationController.getDocument,
);

// Obter aplicação por userId
router.get(
  "/user/:userId",
  apiLimiter,
  authMiddleware,
  ApplicationController.getApplicationByUser,
);

// Aceitar uma aplicação
router.post(
  "/:applicationId/accept",
  authLimiter,
  authMiddleware,
  authorizeRoles("NetworkManager"),
  ApplicationController.acceptApplication,
);

// Rejeitar uma aplicação
router.post(
  "/:applicationId/reject",
  authLimiter,
  authMiddleware,
  authorizeRoles("NetworkManager"),
  ApplicationController.rejectApplication,
);

export default router;
