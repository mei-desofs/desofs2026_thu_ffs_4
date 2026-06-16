import { Router } from "express";
import { OrderController } from "../Controller/OrderController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { verifySelfOrRole } from "../middlewares/ownershipMiddleware";

const router = Router();

router.post("/", authLimiter, authMiddleware, authorizeRoles("StockManager", "NetworkManager"), OrderController.create);
router.put("/:id", apiLimiter, authMiddleware, authorizeRoles("StockManager", "NetworkManager"), OrderController.update);
router.patch("/:id/status", apiLimiter, authMiddleware, authorizeRoles("Supplier", "NetworkManager"), OrderController.updateStatus);
router.delete("/:id", apiLimiter, authMiddleware, authorizeRoles("StockManager", "NetworkManager"), OrderController.delete);
router.get("/:userid", apiLimiter, authMiddleware, verifySelfOrRole("StockManager", "NetworkManager"), OrderController.getByUserId);
router.get("/", apiLimiter, authMiddleware, authorizeRoles("StockManager", "NetworkManager"), OrderController.getAll);
export default router;
