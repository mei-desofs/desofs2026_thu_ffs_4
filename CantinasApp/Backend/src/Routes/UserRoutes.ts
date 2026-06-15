import { Router } from "express";
import { UserController } from "../Controller/UserController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { verifySelfOrRole } from "../middlewares/ownershipMiddleware";

const router = Router();

router.post("/register", authLimiter, UserController.register);
router.post("/login", authLimiter, UserController.login);
router.get("/:id", apiLimiter, authMiddleware, verifySelfOrRole("NetworkManager"), UserController.getById);

router.patch("/startQuarantine/:id", apiLimiter, authMiddleware, authorizeRoles("NetworkManager"), UserController.startQuarantine);
router.patch("/endQuarantine/:id", apiLimiter, authMiddleware, authorizeRoles("NetworkManager"), UserController.endQuarantine);

export default router;
