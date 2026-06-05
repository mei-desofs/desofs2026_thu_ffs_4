import { Router } from "express";
import { WasteReportController } from "../Controller/WasteReportController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";

const router = Router();

router.post("/", authLimiter, WasteReportController.createWasteReport);
router.get("/meal/:mealId", apiLimiter, WasteReportController.getWasteReportsByMeal);
router.get("/date", apiLimiter, WasteReportController.getWasteReportsByDate);
router.get("/consumed-meals", apiLimiter, WasteReportController.getWasteReportsForConsumedMeals);
router.get("/statistics", apiLimiter, WasteReportController.getWasteReportStatistics);

export default router;

