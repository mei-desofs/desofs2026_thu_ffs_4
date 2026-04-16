import { Router } from "express";
import { UserController } from "../Controller/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/:id", UserController.getById);

router.patch("/startQuarantine/:id", UserController.startQuarantine);
router.patch("/endQuarantine/:id", UserController.endQuarantine);

export default router;


/* ex

// Protegido (só admins)
router.get(
  "/all",
  authMiddleware,
  authorizeRoles("Admin", "PT"),
  userController.getAllIncludingInactive,
);
*/