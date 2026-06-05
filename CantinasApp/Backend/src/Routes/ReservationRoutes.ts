import { Router } from "express";
import { ReservationController } from "../Controller/ReservationController";
import { authLimiter } from "../middlewares/rateLimit";

const router = Router();

router.post("/", authLimiter, ReservationController.createReservation);
router.get("/", ReservationController.listReservations);
router.patch("/:id/cancel", ReservationController.cancelReservation);
router.patch("/:id/status", ReservationController.updateStatus);
router.post("/:id/lift", authLimiter, ReservationController.liftTickets);

export default router;


