import { Request, Response } from "express";
import { WasteReportService } from "../Service/WasteReportService";

const service = new WasteReportService();

export class WasteReportController {
    static async createWasteReport(req: Request, res: Response) {
        const { wastePercentage, mealId, reservationId, reportedBy, refeitorioId } = req.body;

        if (!wastePercentage || !mealId || !reportedBy || !refeitorioId) {
            return res.status(400).json({ error: "wastePercentage, mealId, reportedBy, and refeitorioId are required" });
        }

        try {
            const report = await service.createWasteReport({
                wastePercentage: Number(wastePercentage),
                mealId: Number(mealId),
                reservationId: reservationId ? Number(reservationId) : undefined,
                reportedBy: Number(reportedBy),
                refeitorioId: Number(refeitorioId),
            });
            res.status(201).json(report);
        } catch (err: any) {
            if (err.message === "MEAL_NOT_FOUND") return res.status(404).json({ error: "Meal not found" });
            if (err.message === "USER_NOT_FOUND") return res.status(404).json({ error: "User not found" });
            if (err.message === "REFEITORIO_NOT_FOUND") return res.status(404).json({ error: "Refeitório not found" });
            if (err.message === "ONLY_CANTEEN_STAFF_CAN_REPORT") return res.status(403).json({ error: "Only canteen staff can report waste" });
            if (err.message === "USER_CAN_ONLY_REPORT_FOR_OWN_REFEITORIO") return res.status(403).json({ error: "You can only report waste for your own refectory" });
            if (err.message === "RESERVATION_NOT_FOUND") return res.status(404).json({ error: "Reservation not found" });
            if (err.message === "INVALID_WASTE_PERCENTAGE") return res.status(400).json({ error: "Waste percentage must be between 0 and 100" });
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getWasteReportsByMeal(req: Request, res: Response) {
        const { mealId } = req.params;

        if (!mealId) {
            return res.status(400).json({ error: "mealId is required" });
        }

        try {
            const reports = await service.getWasteReportsByMeal(Number(mealId));
            res.status(200).json(reports);
        } catch (err: any) {
            if (err.message === "MEAL_NOT_FOUND") return res.status(404).json({ error: "Meal not found" });
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getWasteReportsByDate(req: Request, res: Response) {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: "date is required" });
        }

        try {
            const reports = await service.getWasteReportsByDate(new Date(date as string));
            res.status(200).json(reports);
        } catch (err: any) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getWasteReportsForConsumedMeals(req: Request, res: Response) {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: "date is required" });
        }

        try {
            const result = await service.getWasteReportsForConsumedMeals(new Date(date as string));
            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getWasteReportStatistics(req: Request, res: Response) {
        const { mealId, dateRangeStart, dateRangeEnd, date, period, dishTypeId, dayOfWeek, refeitorioId } = req.query;

        try {
            const filter: any = {};
            
            if (mealId) {
                const mealIdNum = parseInt(mealId as string);
                if (!isNaN(mealIdNum)) {
                    filter.mealId = mealIdNum;
                }
            }
            
            if (dateRangeStart) {
                filter.dateRangeStart = new Date(dateRangeStart as string);
            }
            
            if (dateRangeEnd) {
                filter.dateRangeEnd = new Date(dateRangeEnd as string);
            }
            
            if (date) {
                filter.date = new Date(date as string);
            }
            
            if (period && (period === "day" || period === "week" || period === "month" || period === "year")) {
                filter.period = period;
            }
            
            if (dishTypeId) {
                const dishTypeIdNum = parseInt(dishTypeId as string);
                if (!isNaN(dishTypeIdNum)) {
                    filter.dishTypeId = dishTypeIdNum;
                }
            }
            
            if (dayOfWeek) {
                const dayOfWeekNum = parseInt(dayOfWeek as string);
                if (!isNaN(dayOfWeekNum) && dayOfWeekNum >= 0 && dayOfWeekNum <= 6) {
                    filter.dayOfWeek = dayOfWeekNum;
                }
            }

            if (refeitorioId) {
                const refeitorioIdNum = parseInt(refeitorioId as string);
                if (!isNaN(refeitorioIdNum)) {
                    filter.refeitorioId = refeitorioIdNum;
                }
            }
            
            const result = await service.getWasteReportStatistics(Object.keys(filter).length > 0 ? filter : undefined);
            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

