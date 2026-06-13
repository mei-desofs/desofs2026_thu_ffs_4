import { Router } from "express";
import { UserController } from "../Controller/UserController";
import { authLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.post("/register", authLimiter, UserController.register);
router.post("/login", authLimiter, UserController.login);
router.post("/verify-email", authLimiter, UserController.verifyEmail);
router.post(
  "/forgot-password",
  authLimiter,
  UserController.requestPasswordReset,
);
router.post("/reset-password", authLimiter, UserController.resetPassword);
router.patch(
  "/password",
  authLimiter,
  authMiddleware,
  UserController.changePassword,
);
router.post(
  "/admin/:id/password-reset",
  authLimiter,
  authMiddleware,
  authorizeRoles("NetworkManager"),
  UserController.adminInitiatePasswordReset,
);
router.get("/:id", UserController.getById);

router.patch("/startQuarantine/:id", UserController.startQuarantine);
router.patch("/endQuarantine/:id", UserController.endQuarantine);

export default router;
