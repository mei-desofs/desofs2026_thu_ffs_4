import { Router } from "express";
import { DishController } from "../Controller/DishController";

const router = Router();

// CRUD Products
router.post("/", DishController.createDish);
router.get("/", DishController.listDishes);
router.get("/recipe/:id", DishController.getDishByRecipe)
router.get("/recommendationsList/:date", DishController.getDishRecommendations);
router.get("/:id", DishController.getDish);

export default router;
