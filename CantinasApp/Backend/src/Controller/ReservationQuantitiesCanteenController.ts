import { Request, Response } from "express";
import { ReservationQuantitiesCanteenService } from "../Service/ReservationQuantitiesCanteenService";

const service = new ReservationQuantitiesCanteenService();

export class ReservationQuantitiesCanteenController {
    static async getCanteenProductionStatistics(req: Request, res: Response) {
        const canteenId = Number(req.params.canteenId);
        if (isNaN(canteenId)) {
            return res.status(400).json({ error: "Invalid canteen ID" });
        }

        try {
            const { date, dateRangeStart, dateRangeEnd, dishId, refeitorioId, dishTypeId, period, dayOfWeek } = req.query;
            
            const filters: any = {};
            if (date) filters.date = date as string;
            if (dateRangeStart) filters.dateRangeStart = dateRangeStart as string;
            if (dateRangeEnd) filters.dateRangeEnd = dateRangeEnd as string;
            if (period) filters.period = period as string;
            if (dayOfWeek !== undefined) {
                const dayOfWeekNum = parseInt(dayOfWeek as string);
                if (!isNaN(dayOfWeekNum)) filters.dayOfWeek = dayOfWeekNum;
            }
            if (dishId) {
                const dishIdNum = parseInt(dishId as string);
                if (!isNaN(dishIdNum)) filters.dishId = dishIdNum;
            }
            if (refeitorioId) {
                const refeitorioIdNum = parseInt(refeitorioId as string);
                if (!isNaN(refeitorioIdNum)) filters.refeitorioId = refeitorioIdNum;
            }
            if (dishTypeId) {
                const dishTypeIdNum = parseInt(dishTypeId as string);
                if (!isNaN(dishTypeIdNum)) filters.dishTypeId = dishTypeIdNum;
            }

            const statistics = await service.getCanteenProductionStatistics(canteenId, filters);
            res.json(statistics);
        } catch (err: any) {
            console.error("Erro ao buscar estatísticas de produção:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getCanteenIngredientsStatistics(req: Request, res: Response) {
        const canteenId = Number(req.params.canteenId);
        if (isNaN(canteenId)) {
            return res.status(400).json({ error: "Invalid canteen ID" });
        }

        try {
            const { 
                date, 
                dateRangeStart, 
                dateRangeEnd, 
                dishId, 
                refeitorioId, 
                dishTypeId,
                period,
                dayOfWeek
            } = req.query;
            
            const filters: any = {};
            if (date) filters.date = date as string;
            if (dateRangeStart) filters.dateRangeStart = dateRangeStart as string;
            if (dateRangeEnd) filters.dateRangeEnd = dateRangeEnd as string;
            if (period) filters.period = period as string;
            if (dayOfWeek !== undefined) {
                const dayOfWeekNum = parseInt(dayOfWeek as string);
                if (!isNaN(dayOfWeekNum)) filters.dayOfWeek = dayOfWeekNum;
            }
            if (dishId) {
                const dishIdNum = parseInt(dishId as string);
                if (!isNaN(dishIdNum)) filters.dishId = dishIdNum;
            }
            if (refeitorioId) {
                const refeitorioIdNum = parseInt(refeitorioId as string);
                if (!isNaN(refeitorioIdNum)) filters.refeitorioId = refeitorioIdNum;
            }
            if (dishTypeId) {
                const dishTypeIdNum = parseInt(dishTypeId as string);
                if (!isNaN(dishTypeIdNum)) filters.dishTypeId = dishTypeIdNum;
            }

            const statistics = await service.getCanteenIngredientsStatistics(canteenId, filters);
            res.json(statistics);
        } catch (err: any) {
            console.error("Erro ao buscar estatísticas de ingredientes:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

