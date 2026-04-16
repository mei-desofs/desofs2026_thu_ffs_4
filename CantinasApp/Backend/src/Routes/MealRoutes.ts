import { Router } from "express";
import { MealController } from "../Controller/MealController";

const router = Router();

// CRUD Products
router.post("/", MealController.createMeal);
router.get("/", MealController.listMeals);
router.get("/canteen/:canteenId/statistics", MealController.getCanteenStatistics);
router.get("/:id", MealController.getMeal);

export default router;
