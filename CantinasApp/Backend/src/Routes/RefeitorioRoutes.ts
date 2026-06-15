import { Router } from "express";
import { RefeitorioController } from "../Controller/RefeitorioController";
import { authLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.post("/", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), RefeitorioController.createRefeitorio);
router.get("/", authMiddleware, RefeitorioController.getAllRefeitorios);
router.get("/:id", authMiddleware, RefeitorioController.getRefeitorioById);

export default router;

