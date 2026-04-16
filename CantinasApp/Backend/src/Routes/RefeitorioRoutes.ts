import { Router } from "express";
import { RefeitorioController } from "../Controller/RefeitorioController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.post("/", RefeitorioController.createRefeitorio);
router.get("/", RefeitorioController.getAllRefeitorios);
router.get("/:id", RefeitorioController.getRefeitorioById);

export default router;

