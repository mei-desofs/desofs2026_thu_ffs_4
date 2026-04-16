import { Router } from "express";
import { RecipeController } from "../Controller/RecipeController";

const router = Router();

// CRUD Products
router.post("/", RecipeController.createRecipe);
router.get("/", RecipeController.listRecipes);
router.get("/:id", RecipeController.getRecipe);

export default router;
