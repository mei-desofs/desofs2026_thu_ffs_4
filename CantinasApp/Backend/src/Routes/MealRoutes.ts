import { Router } from "express";
import { MealController } from "../Controller/MealController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";

const router = Router();

// CRUD Products
router.post("/", authLimiter, MealController.createMeal);
router.get("/", MealController.listMeals);
router.get("/canteen/:canteenId/statistics", apiLimiter, MealController.getCanteenStatistics);
router.get("/:id", MealController.getMeal);

export default router;
