import { Reservation } from "../Model/Reservation";
import { Meal } from "../Model/Meal";
import { Dish } from "../Model/Dish";
import { DishType } from "../Model/DishType";
import { Op } from "sequelize";

export class PerformanceService {
    /**
     * Calcula a percentagem de desperdício baseado nas reservas
     * Percentagem = (not consumed / (consumed + not consumed)) * 100
     */
    async calculateWastePercentage(filter?: {
        date?: Date; // Data específica
        period?: "day" | "week" | "month" | "year"; // Período: dia, semana, mês, ano
        dishTypeId?: number; // ID do tipo de prato (peixe, carne, etc)
        mealTypeId?: number; // ID do tipo de refeição (1=Almoço, 2=Jantar)
        dateRangeStart?: Date; // Data de início do intervalo
        dateRangeEnd?: Date; // Data de fim do intervalo
        dayOfWeek?: number; // 0=Domingo, 1=Segunda, 2=Terça, 3=Quarta, 4=Quinta, 5=Sexta, 6=Sábado
        mealId?: number; // ID da refeição
        refeitorioId?: number; // ID do refeitório (para filtrar por refeitório)
    }) {
        const { Op } = require("sequelize");

        // Construir filtro de data baseado nos parâmetros
        let dateFilter: any = {};

        // Verificar se é filtro por dia da semana com intervalo opcional
        if (filter?.dayOfWeek !== undefined && (filter?.dateRangeStart || filter?.dateRangeEnd)) {
            // Se houver intervalo de datas para filtro por dia da semana, aplicar o intervalo
            const startDate = filter.dateRangeStart ? new Date(filter.dateRangeStart) : null;
            const endDate = filter.dateRangeEnd ? new Date(filter.dateRangeEnd) : null;
            
            if (startDate && endDate) {
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
                dateFilter = {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate,
                };
            } else if (startDate) {
                startDate.setHours(0, 0, 0, 0);
                dateFilter = {
                    [Op.gte]: startDate,
                };
            } else if (endDate) {
                endDate.setHours(23, 59, 59, 999);
                dateFilter = {
                    [Op.lte]: endDate,
                };
            }
        } else if (filter?.dateRangeStart && filter?.dateRangeEnd) {
            // Verificar se é intervalo de tempo personalizado
            const startDate = new Date(filter.dateRangeStart);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(filter.dateRangeEnd);
            endDate.setHours(23, 59, 59, 999);
            
            dateFilter = {
                [Op.gte]: startDate,
                [Op.lte]: endDate,
            };
        } else if (filter?.date && filter?.period) {
            const targetDate = new Date(filter.date);
            let startDate: Date;
            let endDate: Date;

            if (filter.period === "day") {
                // Filtro por dia
                startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
                endDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);
            } else if (filter.period === "week") {
                // Filtro por semana (segunda a domingo)
                const dayOfWeek = targetDate.getDay();
                const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Segunda-feira
                startDate = new Date(targetDate);
                startDate.setDate(targetDate.getDate() + diff);
                startDate.setHours(0, 0, 0, 0);
                
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
            } else if (filter.period === "month") {
                // Filtro por mês
                startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
                endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);
            } else if (filter.period === "year") {
                // Filtro por ano
                startDate = new Date(targetDate.getFullYear(), 0, 1);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(targetDate.getFullYear() + 1, 0, 0, 23, 59, 59, 999);
            } else {
                // Default: dia
                startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
                endDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);
            }
            
            dateFilter = {
                [Op.gte]: startDate,
                [Op.lte]: endDate,
            };
        } else if (filter?.date) {
            // Filtro por data específica (compatibilidade com código antigo)
            const targetDate = new Date(filter.date);
            const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
            const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);
            
            dateFilter = {
                [Op.gte]: startOfDay,
                [Op.lte]: endOfDay,
            };
        }

        // Buscar todas as reservas com status consumed ou not consumed
        // Filtrar pela data da refeição (Meal.date) e tipo de prato
        const mealIncludeOptions: any = {
            model: Meal,
            as: "meal",
            attributes: ["id", "name", "date", "dishId", "mealTypeId"],
            required: true,
            include: [{
                model: Dish,
                as: "dish",
                attributes: ["id", "name", "dishTypeId"],
                required: true,
                include: [{
                    model: DishType,
                    as: "dishType",
                    attributes: ["id", "name"],
                    required: true,
                }],
            }],
        };

        // Adicionar filtro de data e/ou mealId
        const mealWhere: any = {};
        if (dateFilter && Object.keys(dateFilter).length > 0) {
            mealWhere.date = dateFilter;
        }
        if (filter?.mealId) {
            mealWhere.id = filter.mealId;
        }
        if (Object.keys(mealWhere).length > 0) {
            mealIncludeOptions.where = mealWhere;
        }

        // Adicionar filtro de tipo de prato se especificado
        if (filter?.dishTypeId) {
            // O include do Dish está no primeiro nível do include do Meal
            const dishInclude = mealIncludeOptions.include[0];
            if (dishInclude && dishInclude.model === Dish) {
                if (!dishInclude.where) {
                    dishInclude.where = {};
                }
                dishInclude.where.dishTypeId = filter.dishTypeId;
            }
        }

        // Construir where clause para Reservation
        const reservationWhere: any = {
            status: {
                [Op.in]: ["consumed", "not consumed"],
            },
        };

        // Adicionar filtro por refeitório se especificado
        if (filter?.refeitorioId) {
            reservationWhere.refeitorioId = filter.refeitorioId;
        }

        const reservations = await Reservation.findAll({
            where: reservationWhere,
            include: [mealIncludeOptions],
        });

        console.log(`[PerformanceService] Found ${reservations.length} reservations with consumed/not consumed status`);

        // Agrupar por data para retornar detalhes
        const byDate: Record<string, { served: number; notConsumed: number; percentage: number }> = {};
        
        // Agrupar por refeição para retornar detalhes
        const byMeal: Record<number, { 
            mealId: number; 
            mealName: string; 
            mealDate: string; 
            mealTypeId?: number;
            dishTypeId?: number;
            dishName?: string; 
            served: number; // Total marcadas (consumed + not consumed)
            consumed: number; // Apenas consumidas
            notConsumed: number; 
            percentage: number 
        }> = {};
        
        reservations.forEach((reservation: any) => {
            if (!reservation.meal || !reservation.meal.date) return;
            
            const mealDate = new Date(reservation.meal.date);
            const dateKey = mealDate.toISOString().split('T')[0]; // YYYY-MM-DD
            const mealId = reservation.meal.id;
            
            // Agrupar por data
            if (!byDate[dateKey]) {
                byDate[dateKey] = { served: 0, notConsumed: 0, percentage: 0 };
            }
            
            // Agrupar por refeição
            if (!byMeal[mealId]) {
                const mealDateStr = mealDate.toISOString();
                byMeal[mealId] = {
                    mealId: mealId,
                    mealName: reservation.meal.name || `Refeição ID: ${mealId}`,
                    mealDate: mealDateStr,
                    mealTypeId: reservation.meal.mealTypeId,
                    dishTypeId: reservation.meal.dish?.dishTypeId,
                    dishName: reservation.meal.dish?.name,
                    served: 0, // Total marcadas
                    consumed: 0, // Apenas consumidas
                    notConsumed: 0,
                    percentage: 0,
                };
            }
            
            const quantity = reservation.quantity || 1;
            
            if (reservation.status === "consumed") {
                byDate[dateKey].served += quantity;
                byMeal[mealId].served += quantity;
                byMeal[mealId].consumed += quantity;
            } else if (reservation.status === "not consumed") {
                byDate[dateKey].served += quantity;
                byDate[dateKey].notConsumed += quantity;
                byMeal[mealId].served += quantity;
                byMeal[mealId].notConsumed += quantity;
            }
        });

        // Calcular totais
        let totalServed = 0; // consumed + not consumed
        let totalNotConsumed = 0; // not consumed

        reservations.forEach((reservation: any) => {
            if (!reservation.meal) {
                console.log(`[PerformanceService] Reservation ${reservation.id} has no meal`);
                return;
            }
            
            const quantity = reservation.quantity || 1;
            
            if (reservation.status === "consumed") {
                totalServed += quantity;
            } else if (reservation.status === "not consumed") {
                totalServed += quantity;
                totalNotConsumed += quantity;
            }
        });

        console.log(`[PerformanceService] Total served: ${totalServed}, Total not consumed: ${totalNotConsumed}`);

        // Calcular percentagem
        const wastePercentage = totalServed > 0 
            ? (totalNotConsumed / totalServed) * 100 
            : 0;

        // Calcular percentagem por data
        Object.keys(byDate).forEach((dateKey) => {
            const data = byDate[dateKey];
            data.percentage = data.served > 0 ? (data.notConsumed / data.served) * 100 : 0;
        });

        // Calcular percentagem por refeição
        Object.values(byMeal).forEach((mealData) => {
            mealData.percentage = mealData.served > 0 ? (mealData.notConsumed / mealData.served) * 100 : 0;
        });

        // Filtrar byDate e byMeal baseado no filtro de período
        let filteredByDate = Object.entries(byDate);
        let filteredByMeal = Object.values(byMeal);
        
        if (filter?.dayOfWeek !== undefined) {
            // Filtro por dia da semana recorrente
            const targetDayOfWeek = filter.dayOfWeek;
            const rangeStart = filter.dateRangeStart ? new Date(filter.dateRangeStart) : null;
            const rangeEnd = filter.dateRangeEnd ? new Date(filter.dateRangeEnd) : null;
            
            // Filtrar byDate
            filteredByDate = filteredByDate.filter(([dateKey]) => {
                const date = new Date(dateKey);
                const dayOfWeek = date.getDay(); // 0=Domingo, 1=Segunda, etc.
                
                // Verificar se o dia da semana corresponde
                if (dayOfWeek !== targetDayOfWeek) {
                    return false;
                }
                
                // Se houver intervalo de datas, verificar se está dentro do intervalo
                if (rangeStart || rangeEnd) {
                    date.setHours(0, 0, 0, 0);
                    if (rangeStart) {
                        rangeStart.setHours(0, 0, 0, 0);
                        if (date < rangeStart) return false;
                    }
                    if (rangeEnd) {
                        rangeEnd.setHours(23, 59, 59, 999);
                        if (date > rangeEnd) return false;
                    }
                }
                
                return true;
            });
            
            // Filtrar byMeal pelo mesmo critério
            if (rangeStart && rangeEnd) {
                filteredByMeal = filteredByMeal.filter((mealData) => {
                    const mealDate = new Date(mealData.mealDate);
                    const dayOfWeek = mealDate.getDay();
                    
                    // Verificar se o dia da semana corresponde
                    if (dayOfWeek !== targetDayOfWeek) {
                        return false;
                    }
                    
                    // Verificar se está dentro do intervalo
                    mealDate.setHours(0, 0, 0, 0);
                    const start = new Date(rangeStart);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(rangeEnd);
                    end.setHours(23, 59, 59, 999);
                    
                    return mealDate >= start && mealDate <= end;
                });
            }
        } else if (filter?.dateRangeStart && filter?.dateRangeEnd) {
            // Se for filtro por intervalo de tempo, mostrar apenas os dias no intervalo
            const rangeStart = new Date(filter.dateRangeStart);
            rangeStart.setHours(0, 0, 0, 0);
            const rangeEnd = new Date(filter.dateRangeEnd);
            rangeEnd.setHours(23, 59, 59, 999);
            
            filteredByDate = filteredByDate.filter(([dateKey]) => {
                const date = new Date(dateKey);
                date.setHours(0, 0, 0, 0);
                return date >= rangeStart && date <= rangeEnd;
            });
        } else if (filter?.period === "day" && filter?.date) {
            // Se for filtro por dia, mostrar apenas esse dia
            const targetDate = new Date(filter.date);
            const targetDateStr = targetDate.toISOString().split('T')[0];
            filteredByDate = filteredByDate.filter(([dateKey]) => dateKey === targetDateStr);
        } else if (filter?.period === "week" && filter?.date) {
            // Se for filtro por semana, mostrar apenas os dias da semana
            const targetDate = new Date(filter.date);
            const dayOfWeek = targetDate.getDay();
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Segunda-feira
            const weekStart = new Date(targetDate);
            weekStart.setDate(targetDate.getDate() + diff);
            weekStart.setHours(0, 0, 0, 0);
            
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999);
            
            filteredByDate = filteredByDate.filter(([dateKey]) => {
                const date = new Date(dateKey);
                return date >= weekStart && date <= weekEnd;
            });
        } else if (filter?.period === "month" && filter?.date) {
            // Se for filtro por mês, mostrar apenas os dias do mês
            const targetDate = new Date(filter.date);
            const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
            const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);
            
            filteredByDate = filteredByDate.filter(([dateKey]) => {
                const date = new Date(dateKey);
                return date >= monthStart && date <= monthEnd;
            });
        } else if (filter?.period === "year" && filter?.date) {
            // Se for filtro por ano, mostrar apenas os dias do ano
            const targetDate = new Date(filter.date);
            const yearStart = new Date(targetDate.getFullYear(), 0, 1);
            yearStart.setHours(0, 0, 0, 0);
            const yearEnd = new Date(targetDate.getFullYear() + 1, 0, 0, 23, 59, 59, 999);
            
            filteredByDate = filteredByDate.filter(([dateKey]) => {
                const date = new Date(dateKey);
                date.setHours(0, 0, 0, 0);
                return date >= yearStart && date <= yearEnd;
            });
        }

        // Filtrar byMeal baseado no filtro de data (se ainda não foi filtrado por dayOfWeek)
        if (filter?.dayOfWeek === undefined) {
            filteredByMeal = Object.values(byMeal);
        }
        
        if (filter?.period === "day" && filter?.date) {
            // Se for filtro por dia, mostrar apenas refeições desse dia
            const targetDate = new Date(filter.date);
            const targetDateStr = targetDate.toISOString().split('T')[0];
            filteredByMeal = filteredByMeal.filter((mealData) => {
                const mealDate = new Date(mealData.mealDate);
                const mealDateStr = mealDate.toISOString().split('T')[0];
                return mealDateStr === targetDateStr;
            });
        } else if (filter?.dateRangeStart && filter?.dateRangeEnd) {
            // Se for filtro por intervalo, mostrar apenas refeições no intervalo
            const rangeStart = new Date(filter.dateRangeStart);
            rangeStart.setHours(0, 0, 0, 0);
            const rangeEnd = new Date(filter.dateRangeEnd);
            rangeEnd.setHours(23, 59, 59, 999);
            
            filteredByMeal = filteredByMeal.filter((mealData) => {
                const mealDate = new Date(mealData.mealDate);
                return mealDate >= rangeStart && mealDate <= rangeEnd;
            });
        } else if (filter?.date && filter?.period === "week") {
            // Se for filtro por semana, mostrar apenas refeições da semana
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
        } else if (filter?.date && filter?.period === "month") {
            // Se for filtro por mês, mostrar apenas refeições do mês
            const targetDate = new Date(filter.date);
            const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
            const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);
            
            filteredByMeal = filteredByMeal.filter((mealData) => {
                const mealDate = new Date(mealData.mealDate);
                return mealDate >= monthStart && mealDate <= monthEnd;
            });
        }

        // Recalcular totais com base nos dados filtrados
        // Isso garante que os totais reflitam apenas o período filtrado
        let recalculatedTotalServed = 0;
        let recalculatedTotalNotConsumed = 0;
        
        filteredByDate.forEach(([dateKey, data]) => {
            recalculatedTotalServed += data.served;
            recalculatedTotalNotConsumed += data.notConsumed;
        });
        
        // Calcular percentagem com base nos totais recalculados
        const recalculatedWastePercentage = recalculatedTotalServed > 0 
            ? (recalculatedTotalNotConsumed / recalculatedTotalServed) * 100 
            : 0;

        return {
            totalServed: recalculatedTotalServed,
            totalNotConsumed: recalculatedTotalNotConsumed,
            wastePercentage: Number(recalculatedWastePercentage.toFixed(2)),
            byDate: filteredByDate
                .map(([date, data]) => ({
                    date,
                    served: data.served,
                    notConsumed: data.notConsumed,
                    percentage: Number(data.percentage.toFixed(2)),
                }))
                .sort((a, b) => a.date.localeCompare(b.date)),
            byMeal: filteredByMeal
                .map((mealData) => ({
                    mealId: mealData.mealId,
                    mealName: mealData.mealName,
                    mealDate: mealData.mealDate,
                    mealTypeId: mealData.mealTypeId,
                    dishTypeId: mealData.dishTypeId,
                    dishName: mealData.dishName,
                    served: mealData.served, // Total marcadas
                    consumed: mealData.consumed, // Apenas consumidas
                    notConsumed: mealData.notConsumed,
                    percentage: Number(mealData.percentage.toFixed(2)),
                }))
                .sort((a, b) => new Date(a.mealDate).getTime() - new Date(b.mealDate).getTime()),
        };
    }
}

