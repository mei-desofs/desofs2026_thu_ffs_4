import { Router } from "express";
import { WasteReportController } from "../Controller/WasteReportController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.post("/", authMiddleware, authorizeRoles("RefectoryStaff", "RefectoryManager", "CanteenManager", "NetworkManager"), authLimiter, WasteReportController.createWasteReport);
router.get("/meal/:mealId", authMiddleware, authorizeRoles("Nutritionist", "RefectoryManager", "CanteenManager", "NetworkManager"), apiLimiter, WasteReportController.getWasteReportsByMeal);
router.get("/date", authMiddleware, authorizeRoles("Nutritionist", "RefectoryManager", "CanteenManager", "NetworkManager"), apiLimiter, WasteReportController.getWasteReportsByDate);
router.get("/consumed-meals", authMiddleware, authorizeRoles("Nutritionist", "RefectoryManager", "CanteenManager", "NetworkManager"), apiLimiter, WasteReportController.getWasteReportsForConsumedMeals);
router.get("/statistics", authMiddleware, authorizeRoles("Nutritionist", "RefectoryManager", "CanteenManager", "NetworkManager"), apiLimiter, WasteReportController.getWasteReportStatistics);

export default router;

