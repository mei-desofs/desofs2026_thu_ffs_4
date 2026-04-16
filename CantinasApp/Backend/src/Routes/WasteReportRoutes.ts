import { Router } from "express";
import { WasteReportController } from "../Controller/WasteReportController";

const router = Router();

router.post("/", WasteReportController.createWasteReport);
router.get("/meal/:mealId", WasteReportController.getWasteReportsByMeal);
router.get("/date", WasteReportController.getWasteReportsByDate);
router.get("/consumed-meals", WasteReportController.getWasteReportsForConsumedMeals);
router.get("/statistics", WasteReportController.getWasteReportStatistics);

export default router;

