import { Router } from "express";
import { FarmerProductController } from "../Controller/FarmerProductController";

const router = Router();

// Criar produtos do agricultor para uma aplicação
router.post("/", FarmerProductController.create);

// Listar todos
router.get("/", FarmerProductController.list);

// Listar por applicationId
router.get("/application/:applicationId", FarmerProductController.getByApplication);

export default router;
