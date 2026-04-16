import {StockService} from "../Service/StockService";
import {Request, Response} from "express";
import {createStockSchema} from "../Schemas/StockValidation";

const service = new StockService();

export class StockController {

    static async createStock(req: Request, res: Response) {
        const { error } = createStockSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });

        try {
            const result = await service.createStock(req.body);
            res.json(result);
        } catch (err: any) {
            switch (err.message) {
                case "MAXIMUM_CAPACITY_MUST_BE_GREATER_THAN_MINIMUM_CAPACITY":
                    return res.status(409).json({ error: "Max capacity must be greater than min capacity" });
                case "CURRENT_QUANTITY_MUST_BE_BETWEEN_MINIMUM_AND_MAXIMUM_CAPACITY":
                    return res.status(404).json({ error: "Current quantity must be between min and max capacity" });
                default:
                    if (err.message.startsWith("BATCH_NOT_FOUND"))
                        return res.status(404).json({ error: err.message });
                    if (err.message.startsWith("PRODUCT_NOT_FOUND"))
                        return res.status(404).json({ error: err.message });
                    if (err.message.startsWith("UNIT_NOT_FOUND"))
                        return res.status(404).json({ error: err.message });
                    return res.status(500).json({ error: "Internal server error" });
            }
        }
    }

    static async listStocks(req: Request, res: Response) {
        const result = await service.listStocks();
        res.json(result);
    }

    static async getStock(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

        try {
            const stock = await service.getStockById(id);
            res.json(stock);
        } catch (err: any) {
            if (err.message === "STOCK_NOT_FOUND")
                return res.status(404).json({ error: "Stock not found" });
            res.status(500).json({ error: "Internal server error" });
        }
    }
}