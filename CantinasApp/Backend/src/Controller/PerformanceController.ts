import { Request, Response } from "express";
import { PerformanceService } from "../Service/PerformanceService";

const service = new PerformanceService();

export class PerformanceController {
    static async getWastePercentage(req: Request, res: Response) {
        try {
            const { date, period, dishTypeId, dateRangeStart, dateRangeEnd, dayOfWeek, mealId, refeitorioId } = req.query;

            const filter: any = {};

            if (date) {
                filter.date = new Date(date as string);
            }

            if (period && (period === "day" || period === "week" || period === "month" || period === "year")) {
                filter.period = period;
            }

            if (dateRangeStart) {
                filter.dateRangeStart = new Date(dateRangeStart as string);
            }

            if (dateRangeEnd) {
                filter.dateRangeEnd = new Date(dateRangeEnd as string);
            }

            if (dayOfWeek) {
                const dayOfWeekNum = parseInt(dayOfWeek as string);
                if (!isNaN(dayOfWeekNum) && dayOfWeekNum >= 0 && dayOfWeekNum <= 6) {
                    filter.dayOfWeek = dayOfWeekNum;
                }
            }

            if (dishTypeId) {
                const dishTypeIdNum = parseInt(dishTypeId as string);
                if (!isNaN(dishTypeIdNum)) {
                    filter.dishTypeId = dishTypeIdNum;
                }
            }

            if (mealId) {
                const mealIdNum = parseInt(mealId as string);
                if (!isNaN(mealIdNum)) {
                    filter.mealId = mealIdNum;
                }
            }

            if (refeitorioId) {
                const refeitorioIdNum = parseInt(refeitorioId as string);
                if (!isNaN(refeitorioIdNum)) {
                    filter.refeitorioId = refeitorioIdNum;
                }
            }

            console.log("PerformanceController - Filter:", filter);
            const result = await service.calculateWastePercentage(filter);
            console.log("PerformanceController - Result:", {
                totalServed: result.totalServed,
                totalNotConsumed: result.totalNotConsumed,
                wastePercentage: result.wastePercentage,
                byDateCount: result.byDate.length
            });
            res.json(result);
        } catch (err: any) {
            console.error("Error calculating waste percentage:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

