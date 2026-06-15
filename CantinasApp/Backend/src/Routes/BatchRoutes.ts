import { Router } from "express";
import { BatchController } from "../Controller/BatchController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// CRUD Products
router.post("/", authLimiter, authMiddleware, authorizeRoles("StockManager", "NetworkManager"), BatchController.createBatch);
router.get("/", apiLimiter, authMiddleware, authorizeRoles("StockManager", "NetworkManager"), BatchController.listBatches);
router.get("/:id", apiLimiter, authMiddleware, authorizeRoles("StockManager", "NetworkManager"), BatchController.getBatch);

export default router;
