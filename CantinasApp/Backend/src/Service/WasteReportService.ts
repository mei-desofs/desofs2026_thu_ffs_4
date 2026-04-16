import { WasteReport } from "../Model/WasteReport";
import { Meal } from "../Model/Meal";
import { User } from "../Model/User";
import { Reservation } from "../Model/Reservation";
import { Dish } from "../Model/Dish";
import { DishType } from "../Model/DishType";
import { Refeitorio } from "../Model/Refeitorio";

export class WasteReportService {
    async createWasteReport(data: {
        wastePercentage: number;
        mealId: number;
        reservationId?: number;
        reportedBy: number;
        refeitorioId: number;
    }) {
        // Validar mealId
        const meal = await Meal.findByPk(data.mealId);
        if (!meal) throw new Error("MEAL_NOT_FOUND");

        // Validar reportedBy (deve ser canteen staff)
        const user = await User.findByPk(data.reportedBy);
        if (!user) throw new Error("USER_NOT_FOUND");
        if (user.role !== "RefectoryStaff") {
            throw new Error("ONLY_CANTEEN_STAFF_CAN_REPORT");
        }

        // Validar refeitorioId
        const refeitorio = await Refeitorio.findByPk(data.refeitorioId);
        if (!refeitorio) throw new Error("REFEITORIO_NOT_FOUND");
        
        // Validar que o refeitorioId corresponde ao refeitório do utilizador
        if (user.refeitorioId !== data.refeitorioId) {
            throw new Error("USER_CAN_ONLY_REPORT_FOR_OWN_REFEITORIO");
        }

        // Validar reservationId se fornecido
        if (data.reservationId) {
            const reservation = await Reservation.findByPk(data.reservationId);
            if (!reservation) throw new Error("RESERVATION_NOT_FOUND");
        }

        // Validar wastePercentage (0-100)
        if (data.wastePercentage < 0 || data.wastePercentage > 100) {
            throw new Error("INVALID_WASTE_PERCENTAGE");
        }

        return await WasteReport.create({
            wastePercentage: data.wastePercentage,
            mealId: data.mealId,
            reservationId: data.reservationId,
            reportedBy: data.reportedBy,
            refeitorioId: data.refeitorioId,
            reportedAt: new Date(),
        });
    }

    async getWasteReportsByMeal(mealId: number) {
        const meal = await Meal.findByPk(mealId);
        if (!meal) throw new Error("MEAL_NOT_FOUND");

        return await WasteReport.findAll({
            where: { mealId },
            include: [
                { model: User, as: "reporter", attributes: ["id", "name", "email"] },
            ],
            order: [["reportedAt", "DESC"]],
        });
    }

    async getWasteReportsByDate(date: Date) {
        const { Op } = require("sequelize");
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return await WasteReport.findAll({
            where: {
                reportedAt: {
                    [Op.between]: [startOfDay, endOfDay],
                },
            },
            include: [
                { model: Meal, as: "meal", attributes: ["id", "name", "date"] },
                { model: User, as: "reporter", attributes: ["id", "name", "email"] },
            ],
            order: [["reportedAt", "DESC"]],
        });
    }

    async getWasteReportsForConsumedMeals(date: Date) {
        const { Op } = require("sequelize");
        
        // Buscar todas as meals consumidas na data especificada
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Buscar reservas consumidas com meals na data especificada
        const consumedReservations = await Reservation.findAll({
            where: {
                status: "consumed",
            },
            include: [
                {
                    model: Meal,
                    as: "meal",
                    where: {
                        date: {
                            [Op.between]: [startOfDay, endOfDay],
                        },
                    },
                    attributes: ["id", "name", "date"],
                },
            ],
        });

        // Agrupar por mealId para obter meals únicas
        const mealIds = new Set<number>();
        consumedReservations.forEach((reservation: any) => {
            if (reservation.meal) {
                mealIds.add(reservation.meal.id);
            }
        });

        // Verificar quais meals já têm report
        const existingReports = await WasteReport.findAll({
            where: {
                mealId: {
                    [Op.in]: Array.from(mealIds),
                },
            },
            attributes: ["mealId"],
        });

        const reportedMealIds = new Set(existingReports.map((r) => r.mealId));

        // Retornar meals que precisam de report
        const mealsNeedingReport: number[] = [];
        mealIds.forEach((mealId) => {
            if (!reportedMealIds.has(mealId)) {
                mealsNeedingReport.push(mealId);
            }
        });

        return {
            mealsNeedingReport,
            totalConsumedMeals: mealIds.size,
            reportedMeals: reportedMealIds.size,
        };
    }

    async getWasteReportStatistics(filter?: {
        mealId?: number;
        dateRangeStart?: Date;
        dateRangeEnd?: Date;
        date?: Date;
        period?: "day" | "week" | "month" | "year";
        dishTypeId?: number;
        mealTypeId?: number; // ID do tipo de refeição (1=Almoço, 2=Jantar)
        dayOfWeek?: number;
        refeitorioId?: number; // ID do refeitório (para filtrar por refeitório)
    }) {
        const { Op } = require("sequelize");
        
        const whereClause: any = {};
        
        // Filtro por mealId
        if (filter?.mealId) {
            whereClause.mealId = filter.mealId;
        }
        
        // Filtro por refeitorioId (obrigatório para segregar reports por refeitório)
        if (filter?.refeitorioId) {
            whereClause.refeitorioId = filter.refeitorioId;
        }
        
        // Construir filtro de data baseado nos parâmetros
        let dateFilter: any = {};
        let hasPeriodFilter = false;
        
        // Se houver filtro de período (date + period), filtrar pela data da refeição
        if (filter?.date && filter?.period) {
            hasPeriodFilter = true;
            const targetDate = new Date(filter.date);
            let startDate: Date;
            let endDate: Date;

            if (filter.period === "day") {
                startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
                endDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);
            } else if (filter.period === "week") {
                const dayOfWeek = targetDate.getDay();
                const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                startDate = new Date(targetDate);
                startDate.setDate(targetDate.getDate() + diff);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
            } else if (filter.period === "month") {
                startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
                endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);
            } else if (filter.period === "year") {
                startDate = new Date(targetDate.getFullYear(), 0, 1);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(targetDate.getFullYear() + 1, 0, 0, 23, 59, 59, 999);
            } else {
                startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
                endDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);
            }
            
            dateFilter = {
                [Op.gte]: startDate,
                [Op.lte]: endDate,
            };
        } else if (filter?.dateRangeStart && filter?.dateRangeEnd && !filter?.dayOfWeek) {
            // Se houver dateRangeStart e dateRangeEnd sem dayOfWeek, pode ser filtro de período ou de report
            // Se não houver period, assumir que é filtro de período (data da refeição)
            hasPeriodFilter = true;
            const startDate = new Date(filter.dateRangeStart);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(filter.dateRangeEnd);
            endDate.setHours(23, 59, 59, 999);
            
            dateFilter = {
                [Op.gte]: startDate,
                [Op.lte]: endDate,
            };
        } else if ((filter?.dateRangeStart || filter?.dateRangeEnd) && !hasPeriodFilter) {
            // Filtro por data (quando foi reportado) - usar reportedAt apenas se não houver filtro de período
            whereClause.reportedAt = {};
            if (filter.dateRangeStart) {
                const start = new Date(filter.dateRangeStart);
                start.setHours(0, 0, 0, 0);
                whereClause.reportedAt[Op.gte] = start;
            }
            if (filter.dateRangeEnd) {
                const end = new Date(filter.dateRangeEnd);
                end.setHours(23, 59, 59, 999);
                whereClause.reportedAt[Op.lte] = end;
            }
        }

        // Configurar include do Meal com filtros
        const mealIncludeOptions: any = {
            model: Meal,
            as: "meal",
            attributes: ["id", "name", "date", "mealTypeId"],
            required: true,
            include: [
                {
                    model: Dish,
                    as: "dish",
                    attributes: ["id", "name", "dishTypeId"],
                    required: true,
                    include: [
                        {
                            model: DishType,
                            as: "dishType",
                            attributes: ["id", "name"],
                            required: true,
                        },
                    ],
                },
            ],
        };

        // Adicionar filtro de data e mealTypeId na meal se especificado
        const mealWhere: any = {};
        if (dateFilter && Object.keys(dateFilter).length > 0) {
            mealWhere.date = dateFilter;
        }
        if (filter?.mealTypeId) {
            mealWhere.mealTypeId = filter.mealTypeId;
        }
        if (Object.keys(mealWhere).length > 0) {
            mealIncludeOptions.where = mealWhere;
        }

        // Adicionar filtro de tipo de prato
        if (filter?.dishTypeId) {
            const dishInclude = mealIncludeOptions.include[0];
            if (dishInclude && dishInclude.model === Dish) {
                if (!dishInclude.where) {
                    dishInclude.where = {};
                }
                dishInclude.where.dishTypeId = filter.dishTypeId;
            }
        }

        const whereOptions = Object.keys(whereClause).length > 0 ? { where: whereClause } : {};
        
        const reports = await WasteReport.findAll({
            ...whereOptions,
            include: [
                mealIncludeOptions,
                {
                    model: User,
                    as: "reporter",
                    attributes: ["id", "name", "email"],
                    required: false,
                },
            ],
            order: [["reportedAt", "DESC"]],
        });

        // Filtrar por dia da semana se especificado
        let filteredReports = reports;
        if (filter?.dayOfWeek !== undefined) {
            const targetDayOfWeek = filter.dayOfWeek;
            const rangeStart = filter.dateRangeStart ? new Date(filter.dateRangeStart) : null;
            const rangeEnd = filter.dateRangeEnd ? new Date(filter.dateRangeEnd) : null;
            
            filteredReports = reports.filter((report: any) => {
                if (!report.meal || !report.meal.date) return false;
                const mealDate = new Date(report.meal.date);
                const dayOfWeek = mealDate.getDay();
                
                if (dayOfWeek !== targetDayOfWeek) return false;
                
                if (rangeStart || rangeEnd) {
                    mealDate.setHours(0, 0, 0, 0);
                    if (rangeStart) {
                        rangeStart.setHours(0, 0, 0, 0);
                        if (mealDate < rangeStart) return false;
                    }
                    if (rangeEnd) {
                        rangeEnd.setHours(23, 59, 59, 999);
                        if (mealDate > rangeEnd) return false;
                    }
                }
                
                return true;
            });
        } else if (filter?.period === "day" && filter?.date) {
            // Filtrar por dia específico - garantir que apenas reports do dia filtrado sejam incluídos
            const targetDate = new Date(filter.date);
            const targetDateStr = targetDate.toISOString().split('T')[0];
            
            filteredReports = reports.filter((report: any) => {
                if (!report.meal || !report.meal.date) return false;
                const mealDate = new Date(report.meal.date);
                const mealDateStr = mealDate.toISOString().split('T')[0];
                return mealDateStr === targetDateStr;
            });
        }

        // Agrupar por meal
        const byMeal: Record<number, {
            mealId: number;
            mealName: string;
            mealDate: string;
            mealTypeId?: number;
            dishTypeId?: number;
            dishName?: string;
            reports: any[];
            averageWaste: number;
            totalReports: number;
        }> = {};

        filteredReports.forEach((report: any) => {
            const mealId = report.mealId;
            if (!byMeal[mealId]) {
                const mealDate = report.meal?.date ? new Date(report.meal.date).toISOString() : new Date().toISOString();
                byMeal[mealId] = {
                    mealId,
                    mealName: report.meal?.name || `Meal ID: ${mealId}`,
                    mealDate: mealDate,
                    mealTypeId: report.meal?.mealTypeId,
                    dishTypeId: report.meal?.dish?.dishTypeId,
                    dishName: report.meal?.dish?.name,
                    reports: [],
                    averageWaste: 0,
                    totalReports: 0,
                };
            }
            byMeal[mealId].reports.push(report);
        });

        // Calcular média por meal
        Object.values(byMeal).forEach((mealData) => {
            const totalWaste = mealData.reports.reduce((sum, r) => sum + r.wastePercentage, 0);
            mealData.averageWaste = mealData.reports.length > 0 ? totalWaste / mealData.reports.length : 0;
            mealData.totalReports = mealData.reports.length;
        });

        // Filtrar byMeal baseado no filtro de período (se necessário)
        let filteredByMeal = Object.values(byMeal);
        
        if (filter?.period === "day" && filter?.date) {
            // Se for filtro por dia, mostrar apenas meals desse dia
            const targetDate = new Date(filter.date);
            const targetDateStr = targetDate.toISOString().split('T')[0];
            filteredByMeal = filteredByMeal.filter((mealData) => {
                const mealDate = new Date(mealData.mealDate);
                const mealDateStr = mealDate.toISOString().split('T')[0];
                return mealDateStr === targetDateStr;
            });
        } else if (filter?.dateRangeStart && filter?.dateRangeEnd && !filter?.dayOfWeek) {
            // Se for filtro por intervalo, mostrar apenas meals no intervalo
            const rangeStart = new Date(filter.dateRangeStart);
            rangeStart.setHours(0, 0, 0, 0);
            const rangeEnd = new Date(filter.dateRangeEnd);
            rangeEnd.setHours(23, 59, 59, 999);
            
            filteredByMeal = filteredByMeal.filter((mealData) => {
                const mealDate = new Date(mealData.mealDate);
                return mealDate >= rangeStart && mealDate <= rangeEnd;
            });
        } else if (filter?.period === "week" && filter?.date) {
            // Se for filtro por semana, mostrar apenas meals da semana
            const targetDate = new Date(filter.date);
            const dayOfWeek = targetDate.getDay();
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            const weekStart = new Date(targetDate);
            weekStart.setDate(targetDate.getDate() + diff);
            weekStart.setHours(0, 0, 0, 0);
            
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999);
            
            filteredByMeal = filteredByMeal.filter((mealData) => {
                const mealDate = new Date(mealData.mealDate);
                return mealDate >= weekStart && mealDate <= weekEnd;
            });
        } else if (filter?.period === "month" && filter?.date) {
            // Se for filtro por mês, mostrar apenas meals do mês
            const targetDate = new Date(filter.date);
            const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
            const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);
            
            filteredByMeal = filteredByMeal.filter((mealData) => {
                const mealDate = new Date(mealData.mealDate);
                return mealDate >= monthStart && mealDate <= monthEnd;
            });
        } else if (filter?.period === "year" && filter?.date) {
            // Se for filtro por ano, mostrar apenas meals do ano
            const targetDate = new Date(filter.date);
            const yearStart = new Date(targetDate.getFullYear(), 0, 1);
            yearStart.setHours(0, 0, 0, 0);
            const yearEnd = new Date(targetDate.getFullYear() + 1, 0, 0, 23, 59, 59, 999);
            
            filteredByMeal = filteredByMeal.filter((mealData) => {
                const mealDate = new Date(mealData.mealDate);
                mealDate.setHours(0, 0, 0, 0);
                return mealDate >= yearStart && mealDate <= yearEnd;
            });
        }

        // Recalcular totais com base nos dados filtrados
        // Isso garante que os totais reflitam apenas o período filtrado
        const allReports = filteredByMeal.flatMap(m => m.reports);
        const totalReports = allReports.length;
        const averageWaste = totalReports > 0
            ? allReports.reduce((sum, r) => sum + r.wastePercentage, 0) / totalReports
            : 0;

        return {
            totalReports,
            averageWaste,
            byMeal: filteredByMeal,
        };
    }
}

