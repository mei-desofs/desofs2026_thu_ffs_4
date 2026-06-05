import { Router } from "express";
import { InstitutionController } from "../Controller/InstitutionController";
import { authLimiter } from "../middlewares/rateLimit";

const router = Router();

router.post("/", authLimiter, InstitutionController.createInstitution);
router.get("/", InstitutionController.getAllInstitutions);
router.get("/:id", InstitutionController.getInstitutionById);

export default router;

