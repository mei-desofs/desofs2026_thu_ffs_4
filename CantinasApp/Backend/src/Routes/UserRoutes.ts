import { Router } from "express";
import { UserController } from "../Controller/UserController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { verifySelfOrRole } from "../middlewares/ownershipMiddleware";
import { setAntiCachingHeaders } from "../middlewares/noCache";

const router = Router();

router.post("/register", authLimiter, UserController.register);
router.post("/login", authLimiter, setAntiCachingHeaders,  UserController.login);
router.get("/:id", apiLimiter, authMiddleware, verifySelfOrRole("NetworkManager"), UserController.getById);
router.post("/verify-email", authLimiter, UserController.verifyEmail);
router.post(
  "/forgot-password",
  authLimiter,
  setAntiCachingHeaders,
  UserController.requestPasswordReset,
);
router.post("/reset-password", authLimiter, setAntiCachingHeaders, UserController.resetPassword);
router.post("/logout", authLimiter, authMiddleware, setAntiCachingHeaders, UserController.logout);
router.get(
  "/sessions",
  authLimiter,
  authMiddleware,
  setAntiCachingHeaders,
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

router.patch("/startQuarantine/:id", apiLimiter, authMiddleware, authorizeRoles("NetworkManager"), UserController.startQuarantine);
router.patch("/endQuarantine/:id", apiLimiter, authMiddleware, authorizeRoles("NetworkManager"), UserController.endQuarantine);

export default router;
