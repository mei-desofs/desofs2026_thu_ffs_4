import { Router } from "express";
import { RefeitorioController } from "../Controller/RefeitorioController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.post("/", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), RefeitorioController.createRefeitorio);
router.get("/", apiLimiter, authMiddleware, RefeitorioController.getAllRefeitorios);
router.get("/:id", apiLimiter, authMiddleware, RefeitorioController.getRefeitorioById);

export default router;

