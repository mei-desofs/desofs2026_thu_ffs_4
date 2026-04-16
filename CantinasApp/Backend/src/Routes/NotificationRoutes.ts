import { Router } from "express";
import { NotificationController } from "../Controller/NotificationController";

const router = Router();

// criar notificação
router.post("/", NotificationController.create);

// "delete" = marcar como vista
router.put("/:id", NotificationController.markAsSeen);

// GET /notifications/user/:userId
router.get("/user/:userId", NotificationController.getByUserId);

export default router;
