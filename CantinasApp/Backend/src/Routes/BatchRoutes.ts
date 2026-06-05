import { Router } from "express";
import { BatchController } from "../Controller/BatchController";
import { authLimiter } from "../middlewares/rateLimit";

const router = Router();

// CRUD Products
router.post("/", authLimiter, BatchController.createBatch);
router.get("/", BatchController.listBatches);
router.get("/:id", BatchController.getBatch);

export default router;
