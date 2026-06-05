import { Router } from "express";
import { RecipeController } from "../Controller/RecipeController";
import { authLimiter } from "../middlewares/rateLimit";

const router = Router();

// CRUD Products
router.post("/", authLimiter, RecipeController.createRecipe);
router.get("/", RecipeController.listRecipes);
router.get("/:id", RecipeController.getRecipe);

export default router;
