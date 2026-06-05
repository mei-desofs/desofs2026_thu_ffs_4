import { Router } from "express";
import { IngredientController } from "../Controller/IngredientController";
import { authLimiter } from "../middlewares/rateLimit";

const router = Router();

// CRUD Products
router.post("/", authLimiter, IngredientController.createIngredient);
router.get("/", IngredientController.listIngredients);
router.get("/:id", IngredientController.getIngredient);

export default router;
