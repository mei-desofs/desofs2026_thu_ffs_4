import { Router } from "express";
import { ApplicationController } from "../Controller/ApplicationController";
import multer from "multer";
import path from "path";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { verifySelfOrRole } from "../middlewares/ownershipMiddleware";

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
router.post("/", authMiddleware, authorizeRoles("Supplier", "NetworkManager"), authLimiter, upload.array("documents"), ApplicationController.createApplicationWithFiles);

// Atualizar uma aplicação com FarmerProducts e documentos PDF
router.put("/:applicationId", authMiddleware, authorizeRoles("Supplier", "NetworkManager"), authLimiter, upload.array("documents"), ApplicationController.updateApplicationWithFiles);

// Listar todas as aplicações
router.get("/", authMiddleware, authorizeRoles("NetworkManager"), apiLimiter, ApplicationController.listApplications);

// Get document of one application
router.get('/:applicationId/documents/:filename', authMiddleware, authorizeRoles("NetworkManager"), apiLimiter, ApplicationController.getDocument);

// Obter aplicação por userId
router.get("/user/:userId", authMiddleware, verifySelfOrRole("NetworkManager"), apiLimiter, ApplicationController.getApplicationByUser);

// Aceitar uma aplicação
router.post("/:applicationId/accept", authMiddleware, authorizeRoles("NetworkManager"), authLimiter, ApplicationController.acceptApplication);

// Rejeitar uma aplicação
router.post("/:applicationId/reject", authMiddleware, authorizeRoles("NetworkManager"), authLimiter, ApplicationController.rejectApplication);

export default router;
