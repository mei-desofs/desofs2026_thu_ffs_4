import { Router } from "express";
import { ProducerStatisticsController } from "../Controller/ProducerStatisticsController";

const router = Router();

router.get("/", ProducerStatisticsController.getProducerStatistics);

export default router;

