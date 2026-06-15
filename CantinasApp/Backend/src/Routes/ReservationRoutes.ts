import { Router } from "express";
import { ReservationController } from "../Controller/ReservationController";
import { authLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post(
  "/",
  authLimiter,
  authMiddleware,
  ReservationController.createReservation,
);
router.get("/", authLimiter, authMiddleware, ReservationController.listReservations);
router.patch(
  "/:id/cancel",
  authLimiter,
  authMiddleware,
  ReservationController.cancelReservation,
);
router.patch(
  "/:id/status",
  authLimiter,
  authMiddleware,
  ReservationController.updateStatus,
);
router.post(
  "/:id/lift",
  authLimiter,
  authMiddleware,
  ReservationController.liftTickets,
);

export default router;
