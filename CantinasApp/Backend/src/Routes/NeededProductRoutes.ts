import { Router } from "express";
import { NeededProductController } from "../Controller/NeededProductController";
import { authLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.post("/", authMiddleware, authorizeRoles("StockManager", "CanteenManager", "NetworkManager"), authLimiter, NeededProductController.create);
router.put("/:id", authMiddleware, authorizeRoles("StockManager", "CanteenManager", "NetworkManager"), NeededProductController.update);
router.delete("/:id", authMiddleware, authorizeRoles("StockManager", "CanteenManager", "NetworkManager"), NeededProductController.delete);

export default router;
