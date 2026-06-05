import { Router } from "express";
import { ProducerStatisticsController } from "../Controller/ProducerStatisticsController";
import { apiLimiter } from "../middlewares/rateLimit";

const router = Router();

router.get("/", apiLimiter, ProducerStatisticsController.getProducerStatistics);

export default router;

