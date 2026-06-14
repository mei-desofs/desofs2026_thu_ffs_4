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
router.post("/logout", authLimiter, authMiddleware, UserController.logout);
router.get(
  "/sessions",
  authLimiter,
  authMiddleware,
  UserController.listMySessions,
);
router.delete(
  "/sessions",
  authLimiter,
  authMiddleware,
  UserController.terminateAllMySessions,
);
router.delete(
  "/sessions/others",
  authLimiter,
  authMiddleware,
  UserController.terminateOtherMySessions,
);
router.delete(
  "/sessions/:sessionId",
  authLimiter,
  authMiddleware,
  UserController.terminateMySession,
);
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
router.delete(
  "/admin/:id/sessions",
  authLimiter,
  authMiddleware,
  authorizeRoles("NetworkManager"),
  UserController.adminTerminateUserSessions,
);
router.delete(
  "/admin/sessions",
  authLimiter,
  authMiddleware,
  authorizeRoles("NetworkManager"),
  UserController.adminTerminateAllSessions,
);
router.get("/:id", UserController.getById);

router.patch("/startQuarantine/:id", UserController.startQuarantine);
router.patch("/endQuarantine/:id", UserController.endQuarantine);

export default router;
