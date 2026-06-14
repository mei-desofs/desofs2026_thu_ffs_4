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
router.get("/", authMiddleware, ReservationController.listReservations);
router.patch(
  "/:id/cancel",
  authMiddleware,
  ReservationController.cancelReservation,
);
router.patch("/:id/status", authMiddleware, ReservationController.updateStatus);
router.post(
  "/:id/lift",
  authLimiter,
  authMiddleware,
  ReservationController.liftTickets,
);

export default router;
