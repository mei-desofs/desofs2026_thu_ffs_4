import { Router } from "express";
import { RefeitorioController } from "../Controller/RefeitorioController";
import { authLimiter } from "../middlewares/rateLimit";

const router = Router();

router.post("/", authLimiter, RefeitorioController.createRefeitorio);
router.get("/", RefeitorioController.getAllRefeitorios);
router.get("/:id", RefeitorioController.getRefeitorioById);

export default router;

