import { Router } from "express";
import { StockController } from "../Controller/StockController";
import { authLimiter } from "../middlewares/rateLimit";

const router = Router();

// CRUD Products
router.post("/", authLimiter, StockController.createStock);
router.get("/", StockController.listStocks);
router.get("/:id", StockController.getStock);

export default router;
