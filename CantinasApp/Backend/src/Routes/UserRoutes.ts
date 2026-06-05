import { Router } from "express";
import { UserController } from "../Controller/UserController";
import { authLimiter } from "../middlewares/rateLimit";

const router = Router();

router.post("/register", authLimiter, UserController.register);
router.post("/login", authLimiter, UserController.login);
router.get("/:id", UserController.getById);

router.patch("/startQuarantine/:id", UserController.startQuarantine);
router.patch("/endQuarantine/:id", UserController.endQuarantine);

export default router;
