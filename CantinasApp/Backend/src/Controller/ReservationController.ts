import { Request, Response } from "express";
import { ReservationService } from "../Service/ReservationService";

const service = new ReservationService();

export class ReservationController {
    static async createReservation(req: Request, res: Response) {
        const { status = "active", reservationDate = new Date(), quantity = 1, mealId, userId, refeitorioId } = req.body;

        if (!mealId || !userId) {
            return res.status(400).json({ error: "mealId and userId are required" });
        }

        try {
            // Se refeitorioId não for fornecido, buscar da meal
            let finalRefeitorioId = refeitorioId;
            if (!finalRefeitorioId) {
                const { Meal } = await import("../Model/Meal");
                const meal = await Meal.findByPk(mealId);
                if (!meal) {
                    return res.status(404).json({ error: "Meal not found" });
                }
                if (!meal.refeitorioId) {
                    return res.status(400).json({ error: "Meal does not have a refeitorioId associated" });
                }
                finalRefeitorioId = meal.refeitorioId;
            }

            const reservation = await service.createReservation({
                status,
                reservationDate,
                quantity,
                mealId,
                userId,
                refeitorioId: finalRefeitorioId,
            });
            res.status(201).json(reservation);
        } catch (err: any) {
            if (err.message === "MEAL_NOT_FOUND") return res.status(404).json({ error: "Meal not found" });
            if (err.message === "USER_NOT_FOUND") return res.status(404).json({ error: "User not found" });
            if (err.message === "REFEITORIO_NOT_FOUND") return res.status(404).json({ error: "Refeitório not found" });
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async listReservations(req: Request, res: Response) {
        const { userId, status, refeitorioId } = req.query;
        const reservations = await service.listReservations({
            userId: userId ? Number(userId) : undefined,
            status: status as string | undefined,
            refeitorioId: refeitorioId ? Number(refeitorioId) : undefined,
        });
        res.json(reservations);
    }

    static async cancelReservation(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

        try {
            const reservation = await service.updateStatus(id, "canceled");
            res.json(reservation);
        } catch (err: any) {
            if (err.message === "RESERVATION_NOT_FOUND")
                return res.status(404).json({ error: "Reservation not found" });
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async updateStatus(req: Request, res: Response) {
        const id = Number(req.params.id);
        const { status } = req.body;
        
        if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
        if (!status) return res.status(400).json({ error: "Status is required" });

        try {
            const reservation = await service.updateStatus(id, status);
            res.json(reservation);
        } catch (err: any) {
            if (err.message === "RESERVATION_NOT_FOUND")
                return res.status(404).json({ error: "Reservation not found" });
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async liftTickets(req: Request, res: Response) {
        const id = Number(req.params.id);
        const { quantity } = req.body;
        
        if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
        if (!quantity || quantity < 1) return res.status(400).json({ error: "Quantity is required and must be at least 1" });

        try {
            const reservation = await service.liftTickets(id, quantity);
            res.json(reservation);
        } catch (err: any) {
            if (err.message === "RESERVATION_NOT_FOUND")
                return res.status(404).json({ error: "Reservation not found" });
            if (err.message === "RESERVATION_NOT_ACTIVE")
                return res.status(400).json({ error: "Reservation is not active" });
            if (err.message === "INVALID_QUANTITY")
                return res.status(400).json({ error: "Invalid quantity" });
            res.status(500).json({ error: "Internal server error" });
        }
    }

}


