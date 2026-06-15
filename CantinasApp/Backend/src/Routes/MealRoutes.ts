import { Router } from "express";
import { MealController } from "../Controller/MealController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// CRUD Products
router.post("/", authMiddleware, authorizeRoles("Nutritionist", "CanteenManager", "NetworkManager"), authLimiter, MealController.createMeal);
router.get("/", authMiddleware, MealController.listMeals);
router.get("/canteen/:canteenId/statistics", authMiddleware, authorizeRoles("Nutritionist", "CanteenManager", "NetworkManager"), apiLimiter, MealController.getCanteenStatistics);
router.get("/:id", authMiddleware, MealController.getMeal);

export default router;
