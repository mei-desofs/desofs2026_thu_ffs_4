import { Router } from "express";
import { FarmerProductController } from "../Controller/FarmerProductController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// Criar produtos do agricultor para uma aplicação
router.post("/", authLimiter, authMiddleware, authorizeRoles("Supplier", "NetworkManager"), FarmerProductController.create);

// Listar todos
router.get("/", apiLimiter, authMiddleware, authorizeRoles("NetworkManager"), FarmerProductController.list);

// Listar por applicationId
router.get("/application/:applicationId", apiLimiter, authMiddleware, authorizeRoles("NetworkManager"), FarmerProductController.getByApplication);

export default router;
