import { Router } from "express";
import { ParishController } from "../Controller/ParishController";
import { authLimiter } from "../middlewares/rateLimit";

const router = Router();

// CRUD Products
router.post("/", authLimiter, ParishController.createParish);
router.get("/", ParishController.listParishes);
router.get("/:id", ParishController.getParish);
router.patch("/quarantineParish/:id", authLimiter, ParishController.quarantineParish);
router.patch("/takeParishOfQuarantine/:id", authLimiter, ParishController.takeParishOfQuarantine);

export default router;
