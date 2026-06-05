import { Router } from "express";
import { DishController } from "../Controller/DishController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";

const router = Router();

// CRUD Products
router.post("/", authLimiter, DishController.createDish);
router.get("/", DishController.listDishes);
router.get("/recipe/:id", DishController.getDishByRecipe)
router.get("/recommendationsList/:date", apiLimiter, DishController.getDishRecommendations);
router.get("/:id", DishController.getDish);

export default router;
