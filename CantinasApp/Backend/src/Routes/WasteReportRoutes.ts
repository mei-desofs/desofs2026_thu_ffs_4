import { Router } from "express";
import { WasteReportController } from "../Controller/WasteReportController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.post("/", authLimiter, authMiddleware, authorizeRoles("RefectoryStaff", "RefectoryManager", "CanteenManager", "NetworkManager"), WasteReportController.createWasteReport);
router.get("/meal/:mealId", apiLimiter, authMiddleware, authorizeRoles("Nutritionist", "RefectoryManager", "CanteenManager", "NetworkManager"), WasteReportController.getWasteReportsByMeal);
router.get("/date", apiLimiter, authMiddleware, authorizeRoles("Nutritionist", "RefectoryManager", "CanteenManager", "NetworkManager"), WasteReportController.getWasteReportsByDate);
router.get("/consumed-meals", apiLimiter, authMiddleware, authorizeRoles("Nutritionist", "RefectoryManager", "CanteenManager", "NetworkManager"), WasteReportController.getWasteReportsForConsumedMeals);
router.get("/statistics", apiLimiter, authMiddleware, authorizeRoles("Nutritionist", "RefectoryManager", "CanteenManager", "NetworkManager"), WasteReportController.getWasteReportStatistics);

export default router;

