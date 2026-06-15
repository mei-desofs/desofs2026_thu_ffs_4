import { Router } from "express";
import { RecipeController } from "../Controller/RecipeController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// CRUD Products
router.post("/", authLimiter, authMiddleware, authorizeRoles("Nutritionist", "NetworkManager"), RecipeController.createRecipe);
router.get("/", apiLimiter, authMiddleware, RecipeController.listRecipes);
router.get("/:id", apiLimiter, authMiddleware, RecipeController.getRecipe);

export default router;
