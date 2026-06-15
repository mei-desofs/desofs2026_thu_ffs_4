import { Router } from "express";
import { NotificationController } from "../Controller/NotificationController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// criar notificação
router.post(
  "/",
  authLimiter,
  authMiddleware,
  authorizeRoles("NetworkManager"),
  NotificationController.create,
);

// "delete" = marcar como vista
router.put("/:id", apiLimiter, authMiddleware, NotificationController.markAsSeen);

// GET /notifications/user/:userId
router.get(
  "/user/:userId",
  apiLimiter,
  authMiddleware,
  NotificationController.getByUserId,
);

export default router;
