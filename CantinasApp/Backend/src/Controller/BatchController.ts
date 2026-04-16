import {BatchService} from "../Service/BatchService";
import {Request, Response} from "express";
import {createBatchSchema} from "../Schemas/BatchValidation";

const service = new BatchService();

export class BatchController {

    static async createBatch(req: Request, res: Response) {
        const { error } = createBatchSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });

        try {
            const result = await service.createBatch(req.body);
            res.json(result);
        } catch (err: any) {
            switch (err.message) {
                case "PRODUCT_TYPE_NOT_FOUND":
                    return res.status(404).json({ error: "Product type not found" });
                case "UNIT_NOT_FOUND":
                    return res.status(404).json({ error: "Unit not found" });
            }
        }
    }

    static async listBatches(req: Request, res: Response) {
        const result = await service.listBatches();
        res.json(result);
    }

    static async getBatch(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

        try {
            const batch = await service.getBatchById(id);
            res.json(batch);
        } catch (err: any) {
            if (err.message === "BATCH_NOT_FOUND")
                return res.status(404).json({ error: "Batch not found" });
            res.status(500).json({ error: "Internal server error" });
        }
    }
}