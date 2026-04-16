import { Router } from "express";
import { CanteenController } from "../Controller/CanteenController";
import { ReservationQuantitiesCanteenController } from "../Controller/ReservationQuantitiesCanteenController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.post("/", CanteenController.createCanteen);
router.get("/", CanteenController.getAllCanteens);
router.get("/:canteenId/refeitorios", CanteenController.getCanteenRefeitorios);
router.get("/:canteenId/production-statistics", ReservationQuantitiesCanteenController.getCanteenProductionStatistics);
router.get("/:canteenId/ingredients-statistics", ReservationQuantitiesCanteenController.getCanteenIngredientsStatistics);
router.get("/:id", CanteenController.getCanteenById);
router.post("/associate-refeitorio", CanteenController.associateRefeitorio);
router.post("/associate-multiple-refeitorios", CanteenController.associateMultipleRefeitorios);

export default router;


