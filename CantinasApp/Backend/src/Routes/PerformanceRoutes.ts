import { Router } from "express";
import { PerformanceController } from "../Controller/PerformanceController";
import { apiLimiter } from "../middlewares/rateLimit";

const router = Router();

router.get("/waste", apiLimiter, PerformanceController.getWastePercentage);

export default router;

