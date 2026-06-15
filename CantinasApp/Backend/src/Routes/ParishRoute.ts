import { Router } from "express";
import { ParishController } from "../Controller/ParishController";
import { authLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// CRUD Products
router.post("/", authMiddleware, authorizeRoles("NetworkManager"), authLimiter, ParishController.createParish);
router.get("/", authMiddleware, ParishController.listParishes);
router.get("/:id", authMiddleware, ParishController.getParish);
router.patch("/quarantineParish/:id", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), ParishController.quarantineParish);
router.patch("/takeParishOfQuarantine/:id", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), ParishController.takeParishOfQuarantine);

export default router;
