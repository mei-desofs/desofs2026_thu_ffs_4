import { Router } from "express";
import { UserController } from "../Controller/UserController";
import { authLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { verifySelfOrRole } from "../middlewares/ownershipMiddleware";

const router = Router();

router.post("/register", authLimiter, UserController.register);
router.post("/login", authLimiter, UserController.login);
router.get("/:id", authMiddleware, verifySelfOrRole("NetworkManager"), UserController.getById);

router.patch("/startQuarantine/:id", authMiddleware, authorizeRoles("NetworkManager"), UserController.startQuarantine);
router.patch("/endQuarantine/:id", authMiddleware, authorizeRoles("NetworkManager"), UserController.endQuarantine);

export default router;
