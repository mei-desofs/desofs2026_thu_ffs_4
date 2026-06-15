import { Router } from "express";
import { NeededProductController } from "../Controller/NeededProductController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.post("/", authLimiter, authMiddleware, authorizeRoles("StockManager", "CanteenManager", "NetworkManager"), NeededProductController.create);
router.put("/:id", apiLimiter, authMiddleware, authorizeRoles("StockManager", "CanteenManager", "NetworkManager"), NeededProductController.update);
router.delete("/:id", apiLimiter, authMiddleware, authorizeRoles("StockManager", "CanteenManager", "NetworkManager"), NeededProductController.delete);

export default router;
