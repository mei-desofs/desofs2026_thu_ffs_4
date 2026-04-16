import { Request, Response } from "express";
import { OrderService } from "../Service/OrderService";
import { OrderStatus } from "../Model/Order";

export class OrderController {
    static async create(req: Request, res: Response) {
        try {
            const {
                userId,
                neededProductId,
                productId,
                unit,
                quantity,
                date,
                canteenId
            } = req.body;

            if (
                !userId ||
                !neededProductId ||
                !productId ||
                !unit ||
                !quantity
                || !date
                || !canteenId
            ) {
                return res.status(400).json({
                    message:
                        "userId, neededProductId, productId, unit, quantity and date are required",
                });
            }

            const order = await OrderService.create(
                userId,
                neededProductId,
                productId,
                unit,
                quantity,
                date,
                canteenId
            );

            return res.status(201).json(order);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const order = await OrderService.update(
                Number(id),
                req.body
            );

            return res.status(200).json(order);
        } catch (error: any) {
            return res.status(404).json({ message: error.message });
        }
    }

    static async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const allowedStatus: OrderStatus[] = [
                "pending",
                "sent",
                "confirmed",
                "rejected",
                "cancelled",
                "delivered",
            ];

            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    message: "Invalid order status",
                });
            }

            const order = await OrderService.updateStatus(
                Number(id),
                status
            );

            return res.status(200).json(order);
        } catch (error: any) {
            return res.status(404).json({ message: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            await OrderService.delete(Number(id));

            return res.status(200).json({
                message: "Order deleted successfully",
            });
        } catch (error: any) {
            return res.status(404).json({ message: error.message });
        }
    }

    static async getByUserId(req: Request, res: Response) {
        try {
            const { userid } = req.params;
            const orders = await OrderService.getByUserId(Number(userid));
            return res.status(200).json(orders);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const orders = await OrderService.getAll();
            return res.status(200).json(orders);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}
