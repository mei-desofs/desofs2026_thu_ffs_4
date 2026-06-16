import { Router } from "express";
import { ParishController } from "../Controller/ParishController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// CRUD Products
router.post("/", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), ParishController.createParish);
router.get("/", apiLimiter, authMiddleware, ParishController.listParishes);
router.get("/:id", apiLimiter, authMiddleware, ParishController.getParish);
router.patch("/quarantineParish/:id", apiLimiter, authLimiter, authMiddleware, authorizeRoles("NetworkManager"), ParishController.quarantineParish);
router.patch("/takeParishOfQuarantine/:id", apiLimiter, authLimiter, authMiddleware, authorizeRoles("NetworkManager"), ParishController.takeParishOfQuarantine);

export default router;
