import { Router } from "express";
import { CanteenController } from "../Controller/CanteenController";
import { ReservationQuantitiesCanteenController } from "../Controller/ReservationQuantitiesCanteenController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.post("/", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), CanteenController.createCanteen);
router.get("/", apiLimiter,  authMiddleware, CanteenController.getAllCanteens);
router.get("/:canteenId/refeitorios", apiLimiter, authMiddleware, CanteenController.getCanteenRefeitorios);
router.get("/:canteenId/production-statistics", apiLimiter, authMiddleware, authorizeRoles("Nutritionist", "CanteenManager", "NetworkManager"), ReservationQuantitiesCanteenController.getCanteenProductionStatistics);
router.get("/:canteenId/ingredients-statistics", apiLimiter, authMiddleware, authorizeRoles("Nutritionist", "CanteenManager", "NetworkManager"), ReservationQuantitiesCanteenController.getCanteenIngredientsStatistics);
router.get("/:id", apiLimiter, authMiddleware, CanteenController.getCanteenById);
router.post("/associate-refeitorio", authLimiter, authMiddleware, authorizeRoles("CanteenManager", "NetworkManager"), CanteenController.associateRefeitorio);
router.post("/associate-multiple-refeitorios", authLimiter, authMiddleware, authorizeRoles("CanteenManager", "NetworkManager"), CanteenController.associateMultipleRefeitorios);

export default router;


