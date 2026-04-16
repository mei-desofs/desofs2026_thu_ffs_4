import { Router } from "express";
import { ParishController } from "../Controller/ParishController";

const router = Router();

// CRUD Products
router.post("/", ParishController.createParish);
router.get("/", ParishController.listParishes);
router.get("/:id", ParishController.getParish);
router.patch("/quarantineParish/:id", ParishController.quarantineParish);
router.patch("/takeParishOfQuarantine/:id", ParishController.takeParishOfQuarantine);

export default router;
