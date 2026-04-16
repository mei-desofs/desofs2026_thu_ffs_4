import { Request, Response } from "express";
import { NeededProductService } from "../Service/NeededProductService";

export class NeededProductController {
    static async create(req: Request, res: Response) {
        try {
            const { date, productId, mealId, unit, quantity, canteenId } = req.body;

            if (!date || !productId || !unit || !quantity || !canteenId) {
                return res.status(400).json({
                    message: "date, productId, unit, quantity and canteenId are required",
                });
            }

            const neededProduct = await NeededProductService.create(
                new Date(date),
                productId,
                mealId,
                unit,
                quantity,
                canteenId
            );

            return res.status(201).json(neededProduct);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const neededProduct = await NeededProductService.update(
                Number(id),
                req.body
            );

            return res.status(200).json(neededProduct);
        } catch (error: any) {
            return res.status(404).json({ message: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            await NeededProductService.delete(Number(id));

            return res.status(200).json({
                message: "NeededProduct deleted successfully",
            });
        } catch (error: any) {
            return res.status(404).json({ message: error.message });
        }
    }
}
