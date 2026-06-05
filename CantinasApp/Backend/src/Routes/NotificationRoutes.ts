import { Router } from "express";
import { NotificationController } from "../Controller/NotificationController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";

const router = Router();

// criar notificação
router.post("/", authLimiter, NotificationController.create);

// "delete" = marcar como vista
router.put("/:id", NotificationController.markAsSeen);

// GET /notifications/user/:userId
router.get("/user/:userId", apiLimiter, NotificationController.getByUserId);

export default router;
