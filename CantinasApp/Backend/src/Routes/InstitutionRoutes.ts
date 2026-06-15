import { Router } from "express";
import { InstitutionController } from "../Controller/InstitutionController";
import { authLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.post("/", authMiddleware, authorizeRoles("NetworkManager"), authLimiter, InstitutionController.createInstitution);
router.get("/", authMiddleware, InstitutionController.getAllInstitutions);
router.get("/:id", authMiddleware, InstitutionController.getInstitutionById);

export default router;

