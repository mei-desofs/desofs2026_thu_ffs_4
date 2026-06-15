import { Router } from "express";
import { IngredientController } from "../Controller/IngredientController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// CRUD Products
router.post("/", authLimiter, authMiddleware, authorizeRoles("Nutritionist", "CanteenManager", "NetworkManager"), IngredientController.createIngredient);
router.get("/", apiLimiter, authMiddleware, IngredientController.listIngredients);
router.get("/:id", apiLimiter, authMiddleware, IngredientController.getIngredient);

export default router;
