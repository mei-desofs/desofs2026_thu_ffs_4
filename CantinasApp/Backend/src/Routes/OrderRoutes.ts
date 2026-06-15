import { Router } from "express";
import { OrderController } from "../Controller/OrderController";
import { authLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { verifySelfOrRole } from "../middlewares/ownershipMiddleware";

const router = Router();

router.post("/", authLimiter, authMiddleware, authorizeRoles("StockManager", "NetworkManager"), OrderController.create);
router.put("/:id", authMiddleware, authorizeRoles("StockManager", "NetworkManager"), OrderController.update);
router.patch("/:id/status", authMiddleware, authorizeRoles("Supplier", "NetworkManager"), OrderController.updateStatus);
router.delete("/:id", authMiddleware, authorizeRoles("StockManager", "NetworkManager"), OrderController.delete);
router.get("/:userid", authMiddleware, verifySelfOrRole("StockManager", "NetworkManager"), OrderController.getByUserId);
router.get("/", authMiddleware, authorizeRoles("StockManager", "NetworkManager"), OrderController.getAll);
export default router;
