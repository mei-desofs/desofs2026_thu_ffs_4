import { Router } from "express";
import { PerformanceController } from "../Controller/PerformanceController";

const router = Router();

router.get("/waste", PerformanceController.getWastePercentage);

export default router;

