import { Router } from "express";
import { MealController } from "../Controller/MealController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// CRUD Products
router.post("/", authLimiter, authMiddleware, authorizeRoles("Nutritionist", "CanteenManager", "NetworkManager"), MealController.createMeal);
router.get("/", apiLimiter, authMiddleware, MealController.listMeals);
router.get("/canteen/:canteenId/statistics", apiLimiter, authMiddleware, authorizeRoles("Nutritionist", "CanteenManager", "NetworkManager"), MealController.getCanteenStatistics);
router.get("/:id", apiLimiter, authMiddleware, MealController.getMeal);

export default router;
