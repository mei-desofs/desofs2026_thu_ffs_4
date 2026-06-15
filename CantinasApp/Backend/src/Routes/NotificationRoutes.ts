import { Router } from "express";
import { NotificationController } from "../Controller/NotificationController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { verifySelfOrRole } from "../middlewares/ownershipMiddleware";

const router = Router();

// criar notificação
router.post("/", authLimiter, authMiddleware, authorizeRoles("Supplier", "CanteenManager", "NetworkManager"), NotificationController.create);

// "delete" = marcar como vista
router.put("/:id", apiLimiter, authMiddleware, authorizeRoles("Supplier", "CanteenManager", "NetworkManager"), NotificationController.markAsSeen);

// GET /notifications/user/:userId
router.get("/user/:userId", apiLimiter, authMiddleware, verifySelfOrRole(), NotificationController.getByUserId);

export default router;
