import { Router } from "express";
import { NeededProductController } from "../Controller/NeededProductController";
import { authLimiter } from "../middlewares/rateLimit";

const router = Router();

router.post("/", authLimiter, NeededProductController.create);
router.put("/:id", NeededProductController.update);
router.delete("/:id", NeededProductController.delete);

export default router;
