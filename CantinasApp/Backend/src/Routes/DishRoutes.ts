import { Router } from "express";
import { DishController } from "../Controller/DishController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// CRUD Products
router.post("/", authLimiter, authMiddleware, authorizeRoles("CanteenManager", "NetworkManager"), DishController.createDish);
router.get("/", apiLimiter, authMiddleware, DishController.listDishes);
router.get("/recipe/:id", apiLimiter, authMiddleware, DishController.getDishByRecipe)
router.get("/recommendationsList/:date", apiLimiter, authMiddleware, DishController.getDishRecommendations);
router.get("/:id", apiLimiter, authMiddleware, DishController.getDish);

export default router;
