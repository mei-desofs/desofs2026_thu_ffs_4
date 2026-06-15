import { Router } from "express";
import { CanteenController } from "../Controller/CanteenController";
import { ReservationQuantitiesCanteenController } from "../Controller/ReservationQuantitiesCanteenController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.post("/", authMiddleware, authorizeRoles("NetworkManager"), authLimiter, CanteenController.createCanteen);
router.get("/", authMiddleware, CanteenController.getAllCanteens);
router.get("/:canteenId/refeitorios", authMiddleware, CanteenController.getCanteenRefeitorios);
router.get("/:canteenId/production-statistics", authMiddleware, authorizeRoles("Nutritionist", "CanteenManager", "NetworkManager"), apiLimiter, ReservationQuantitiesCanteenController.getCanteenProductionStatistics);
router.get("/:canteenId/ingredients-statistics", authMiddleware, authorizeRoles("Nutritionist", "CanteenManager", "NetworkManager"), apiLimiter, ReservationQuantitiesCanteenController.getCanteenIngredientsStatistics);
router.get("/:id", authMiddleware, CanteenController.getCanteenById);
router.post("/associate-refeitorio", authMiddleware, authorizeRoles("CanteenManager", "NetworkManager"), authLimiter, CanteenController.associateRefeitorio);
router.post("/associate-multiple-refeitorios", authMiddleware, authorizeRoles("CanteenManager", "NetworkManager"), authLimiter, CanteenController.associateMultipleRefeitorios);

export default router;


