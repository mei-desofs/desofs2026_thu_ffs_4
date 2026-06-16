import { Router } from "express";
import { StockController } from "../Controller/StockController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// CRUD Products
router.post("/", authLimiter, authMiddleware, authorizeRoles("CanteenManager", "NetworkManager"), StockController.createStock);
router.get("/", apiLimiter, authMiddleware, authorizeRoles("NetworkManager"), StockController.listStocks);
router.get("/:id", apiLimiter, authMiddleware, authorizeRoles("StockManager", "CanteenManager", "NetworkManager"), StockController.getStock);

export default router;
