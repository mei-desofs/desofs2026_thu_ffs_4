import { Request, Response } from "express";
import { ProducerStatisticsService } from "../Service/ProducerStatisticsService";

export class ProducerStatisticsController {
    static async getProducerStatistics(req: Request, res: Response) {
        try {
            const service = new ProducerStatisticsService();
            const producerId = req.query.producerId ? Number(req.query.producerId) : undefined;
            
            const statistics = await service.getProducerStatistics({
                producerId
            });

            res.status(200).json(statistics);
        } catch (error: any) {
            console.error("Erro ao obter estatísticas de produtores:", error);
            res.status(500).json({ error: "Erro ao obter estatísticas de produtores" });
        }
    }
}

