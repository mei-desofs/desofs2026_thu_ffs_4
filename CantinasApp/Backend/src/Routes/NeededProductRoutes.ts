import { Router } from "express";
import { NeededProductController } from "../Controller/NeededProductController";

const router = Router();

router.post("/", NeededProductController.create);
router.put("/:id", NeededProductController.update);
router.delete("/:id", NeededProductController.delete);

export default router;
