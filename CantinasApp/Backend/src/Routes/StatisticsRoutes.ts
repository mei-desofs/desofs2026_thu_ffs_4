import { Router } from "express";
import { StatisticsController } from "../Controller/StatisticsController";
import { apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// CRUD Products
router.get("/", authMiddleware, authorizeRoles("Nutritionist", "CanteenManager", "NetworkManager"), apiLimiter, StatisticsController.getBioProductsPercentageForRecipe);

export default router;
