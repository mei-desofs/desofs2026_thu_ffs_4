import { Router } from "express";
import { InstitutionController } from "../Controller/InstitutionController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.post("/", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), InstitutionController.createInstitution);
router.get("/", apiLimiter, authMiddleware, InstitutionController.getAllInstitutions);
router.get("/:id", apiLimiter, authMiddleware, InstitutionController.getInstitutionById);

export default router;

