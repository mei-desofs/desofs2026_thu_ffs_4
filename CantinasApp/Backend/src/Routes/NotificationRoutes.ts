import { Router } from "express";
import { NotificationController } from "../Controller/NotificationController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { verifySelfOrRole } from "../middlewares/ownershipMiddleware";

const router = Router();

// criar notificação
router.post("/", authMiddleware, authorizeRoles("Supplier", "CanteenManager", "NetworkManager"), authLimiter, NotificationController.create);

// "delete" = marcar como vista
router.put("/:id", authMiddleware, authorizeRoles("Supplier", "CanteenManager", "NetworkManager"), NotificationController.markAsSeen);

// GET /notifications/user/:userId
router.get("/user/:userId", authMiddleware, verifySelfOrRole(), apiLimiter, NotificationController.getByUserId);

export default router;
