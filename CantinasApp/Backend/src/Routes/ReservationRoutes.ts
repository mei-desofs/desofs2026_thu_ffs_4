import { Router } from "express";
import { ReservationController } from "../Controller/ReservationController";
import { authLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.post("/", authMiddleware, authorizeRoles("Student", "Visitor", "NursingHome", "NetworkManager"), authLimiter, ReservationController.createReservation);
router.get("/", authMiddleware, authorizeRoles("Student", "Visitor", "NursingHome", "RefectoryStaff", "RefectoryManager", "CanteenManager", "NetworkManager"), ReservationController.listReservations);
router.patch("/:id/cancel", authMiddleware, authorizeRoles("Student", "Visitor", "NursingHome", "NetworkManager"), ReservationController.cancelReservation);
router.patch("/:id/status", authMiddleware, authorizeRoles("NetworkManager"), ReservationController.updateStatus);
router.post("/:id/lift", authMiddleware, authorizeRoles("RefectoryStaff", "RefectoryManager", "NetworkManager"), authLimiter, ReservationController.liftTickets);

export default router;


