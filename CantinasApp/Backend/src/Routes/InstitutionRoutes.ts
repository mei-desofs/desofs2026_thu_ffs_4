import { Router } from "express";
import { InstitutionController } from "../Controller/InstitutionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.post("/", InstitutionController.createInstitution);
router.get("/", InstitutionController.getAllInstitutions);
router.get("/:id", InstitutionController.getInstitutionById);

export default router;

