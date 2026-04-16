import { Router } from "express";
import { BatchController } from "../Controller/BatchController";

const router = Router();

// CRUD Products
router.post("/", BatchController.createBatch);
router.get("/", BatchController.listBatches);
router.get("/:id", BatchController.getBatch);

export default router;
