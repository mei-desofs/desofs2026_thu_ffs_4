import { Router } from "express";
import { StockController } from "../Controller/StockController";
import { authLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// CRUD Products
router.post("/", authMiddleware, authorizeRoles("CanteenManager", "NetworkManager"), authLimiter, StockController.createStock);
router.get("/", authMiddleware, authorizeRoles("NetworkManager"), StockController.listStocks);
router.get("/:id", authMiddleware, authorizeRoles("StockManager", "CanteenManager", "NetworkManager"), StockController.getStock);

export default router;
