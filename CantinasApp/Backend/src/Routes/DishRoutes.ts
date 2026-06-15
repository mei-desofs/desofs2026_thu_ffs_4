import { Router } from "express";
import { DishController } from "../Controller/DishController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// CRUD Products
router.post("/", authMiddleware, authorizeRoles("CanteenManager", "NetworkManager"), authLimiter, DishController.createDish);
router.get("/", authMiddleware, DishController.listDishes);
router.get("/recipe/:id", authMiddleware, DishController.getDishByRecipe)
router.get("/recommendationsList/:date", authMiddleware, apiLimiter, DishController.getDishRecommendations);
router.get("/:id", authMiddleware, DishController.getDish);

export default router;
