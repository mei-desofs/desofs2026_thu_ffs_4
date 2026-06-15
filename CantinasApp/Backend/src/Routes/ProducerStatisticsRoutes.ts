import { Router } from "express";
import { ProducerStatisticsController } from "../Controller/ProducerStatisticsController";
import { apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.get("/", authMiddleware, authorizeRoles("NetworkManager"), apiLimiter, ProducerStatisticsController.getProducerStatistics);

export default router;

