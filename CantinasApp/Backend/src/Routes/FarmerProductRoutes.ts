import { Router } from "express";
import { FarmerProductController } from "../Controller/FarmerProductController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";

const router = Router();

// Criar produtos do agricultor para uma aplicação
router.post("/", authLimiter, FarmerProductController.create);

// Listar todos
router.get("/", apiLimiter, FarmerProductController.list);

// Listar por applicationId
router.get("/application/:applicationId", FarmerProductController.getByApplication);

export default router;
