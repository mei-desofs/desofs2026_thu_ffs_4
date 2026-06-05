import { Router } from "express";
import { StatisticsController } from "../Controller/StatisticsController";
import { apiLimiter } from "../middlewares/rateLimit";

const router = Router();

// CRUD Products
router.get("/", apiLimiter, StatisticsController.getBioProductsPercentageForRecipe);

export default router;
