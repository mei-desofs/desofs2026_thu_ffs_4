import { Router } from "express";
import { OrderController } from "../Controller/OrderController";

const router = Router();

router.post("/", OrderController.create);
router.put("/:id", OrderController.update);
router.patch("/:id/status", OrderController.updateStatus);
router.delete("/:id", OrderController.delete);
router.get("/:userid", OrderController.getByUserId);
router.get("/", OrderController.getAll);
export default router;
