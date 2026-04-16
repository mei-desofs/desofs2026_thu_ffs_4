import { Router } from "express";
import { StatisticsController } from "../Controller/StatisticsController";

const router = Router();

// CRUD Products
router.get("/", StatisticsController.getBioProductsPercentageForRecipe);

export default router;
