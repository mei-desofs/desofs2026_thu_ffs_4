import { Router } from "express";
import { PerformanceController } from "../Controller/PerformanceController";
import { apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.get("/waste", authMiddleware, authorizeRoles("Nutritionist", "RefectoryManager", "CanteenManager", "NetworkManager"), apiLimiter, PerformanceController.getWastePercentage);

export default router;

