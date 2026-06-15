import { Router } from "express";
import { DishController } from "../Controller/DishController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// CRUD Products
router.post("/", authLimiter, authMiddleware, authorizeRoles("CanteenManager", "NetworkManager"), DishController.createDish);
router.get("/", authMiddleware, DishController.listDishes);
router.get("/recipe/:id", authMiddleware, DishController.getDishByRecipe)
router.get("/recommendationsList/:date", apiLimiter, authMiddleware, DishController.getDishRecommendations);
router.get("/:id", authMiddleware, DishController.getDish);

export default router;
