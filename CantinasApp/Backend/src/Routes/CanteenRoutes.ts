import { Router } from "express";
import { CanteenController } from "../Controller/CanteenController";
import { ReservationQuantitiesCanteenController } from "../Controller/ReservationQuantitiesCanteenController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";

const router = Router();

router.post("/", authLimiter, CanteenController.createCanteen);
router.get("/", CanteenController.getAllCanteens);
router.get("/:canteenId/refeitorios", CanteenController.getCanteenRefeitorios);
router.get("/:canteenId/production-statistics", apiLimiter, ReservationQuantitiesCanteenController.getCanteenProductionStatistics);
router.get("/:canteenId/ingredients-statistics", apiLimiter, ReservationQuantitiesCanteenController.getCanteenIngredientsStatistics);
router.get("/:id", CanteenController.getCanteenById);
router.post("/associate-refeitorio", authLimiter, CanteenController.associateRefeitorio);
router.post("/associate-multiple-refeitorios", authLimiter, CanteenController.associateMultipleRefeitorios);

export default router;


