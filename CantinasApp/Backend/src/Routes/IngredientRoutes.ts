import { Router } from "express";
import { IngredientController } from "../Controller/IngredientController";

const router = Router();

// CRUD Products
router.post("/", IngredientController.createIngredient);
router.get("/", IngredientController.listIngredients);
router.get("/:id", IngredientController.getIngredient);

export default router;
