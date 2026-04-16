import { Router } from "express";
import { StockController } from "../Controller/StockController";

const router = Router();

// CRUD Products
router.post("/", StockController.createStock);
router.get("/", StockController.listStocks);
router.get("/:id", StockController.getStock);

export default router;
