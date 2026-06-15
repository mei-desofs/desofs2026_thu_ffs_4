import { Router } from "express";
import { BatchController } from "../Controller/BatchController";
import { authLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// CRUD Products
router.post("/", authMiddleware, authorizeRoles("StockManager", "NetworkManager"), authLimiter, BatchController.createBatch);
router.get("/", authMiddleware, authorizeRoles("StockManager", "NetworkManager"), BatchController.listBatches);
router.get("/:id", authMiddleware, authorizeRoles("StockManager", "NetworkManager"), BatchController.getBatch);

export default router;
