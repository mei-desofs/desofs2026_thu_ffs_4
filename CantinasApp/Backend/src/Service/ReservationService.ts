import { Reservation } from "../Model/Reservation";
import { Meal } from "../Model/Meal";
import { User } from "../Model/User";
import { Dish } from "../Model/Dish";
import { Refeitorio } from "../Model/Refeitorio";
import { Canteen } from "../Model/Canteen";
import { ReservationQuantitiesCanteen } from "../Model/ReservationQuantitiesCanteen";

export class ReservationService {
    // Função helper para atualizar a tabela reservation_quantities_canteen
    private async updateReservationQuantitiesCanteen(
        mealId: number,
        refeitorioId: number,
        quantityChange: number,
        operation: "add" | "subtract"
    ) {
        try {
            const meal = await Meal.findByPk(mealId);
            if (!meal) return; // Se meal não existir, não fazer nada

            // Normalizar a data para o início do dia (remover horas)
            const mealDate = new Date(meal.date);
            mealDate.setHours(0, 0, 0, 0);

            // Procurar ou criar registo na tabela usando o refeitorioId da reserva (não da meal)
            // Isso permite que a mesma meal seja contabilizada separadamente por refeitório
            const [record, created] = await ReservationQuantitiesCanteen.findOrCreate({
                where: {
                    canteenId: meal.canteenId,
                    dishId: meal.dishId,
                    date: mealDate,
                    refeitorioId: refeitorioId, // Usar o refeitorioId da reserva, não da meal
                },
                defaults: {
                    canteenId: meal.canteenId,
                    dishId: meal.dishId,
                    date: mealDate,
                    refeitorioId: refeitorioId, // Usar o refeitorioId da reserva
                    quantity: 0,
                },
            });

            // Atualizar a quantity
            if (operation === "add") {
                record.quantity += quantityChange;
            } else if (operation === "subtract") {
                record.quantity = Math.max(0, record.quantity - quantityChange); // Não permitir valores negativos
            }

            await record.save();
        } catch (error) {
            console.error("Erro ao atualizar reservation_quantities_canteen:", error);
            // Não lançar erro para não quebrar o fluxo principal
        }
    }

    async createReservation(data: {
        status: "active" | "consumed" | "not consumed" | "pendent" | "canceled";
        reservationDate: Date;
        quantity: number;
        mealId: number;
        userId: number;
        refeitorioId: number;
    }) {
        const meal = await Meal.findByPk(data.mealId);
        if (!meal) throw new Error("MEAL_NOT_FOUND");

        const user = await User.findByPk(data.userId);
        if (!user) throw new Error("USER_NOT_FOUND");

        const refeitorio = await Refeitorio.findByPk(data.refeitorioId);
        if (!refeitorio) throw new Error("REFEITORIO_NOT_FOUND");

        const reservation = await Reservation.create(data);

        // Atualizar a tabela reservation_quantities_canteen apenas se a reserva não for cancelada
        // Usar o refeitorioId da reserva para segregar corretamente
        if (data.status !== "canceled") {
            await this.updateReservationQuantitiesCanteen(data.mealId, data.refeitorioId, data.quantity, "add");
        }

        return reservation;
    }

    async listReservations(filter?: { userId?: number; status?: string; refeitorioId?: number }) {
        const { Op } = require("sequelize");
        const where: any = {};
        if (filter?.userId) where.userId = filter.userId;
        if (filter?.refeitorioId) where.refeitorioId = filter.refeitorioId;
        // Excluir reservas canceladas sempre
        if (filter?.status && filter.status !== "all") {
            where.status = filter.status;
        } else {
            where.status = { [Op.ne]: "canceled" };
        }
        return await Reservation.findAll({ 
            where,
            include: [
                { model: User, as: "user", attributes: ["id", "name", "email"] },
                { model: Refeitorio, as: "refeitorio", attributes: ["id", "name"] },
                { 
                    model: Meal, 
                    as: "meal", 
                    attributes: ["id", "name", "date", "mealTypeId", "canteenId"],
                    include: [
                        { model: Dish, as: "dish", attributes: ["id", "name"] },
                        { model: Canteen, as: "canteen", attributes: ["id", "name"] }
                    ]
                }
            ]
        });
    }

    async updateStatus(id: number, status: "canceled" | "active" | "consumed" | "not consumed" | "pendent") {
        const reservation = await Reservation.findByPk(id);
        if (!reservation) throw new Error("RESERVATION_NOT_FOUND");
        
        const oldStatus = reservation.status;
        reservation.status = status;
        await reservation.save();

        // Atualizar a tabela reservation_quantities_canteen quando o status muda
        // Usar o refeitorioId da reserva para segregar corretamente
        // Se mudou de não-cancelado para cancelado, subtrair
        if (oldStatus !== "canceled" && status === "canceled") {
            await this.updateReservationQuantitiesCanteen(reservation.mealId, reservation.refeitorioId, reservation.quantity, "subtract");
        }
        // Se mudou de cancelado para não-cancelado, adicionar
        else if (oldStatus === "canceled" && status !== "canceled") {
            await this.updateReservationQuantitiesCanteen(reservation.mealId, reservation.refeitorioId, reservation.quantity, "add");
        }

        return reservation;
    }

    async liftTickets(id: number, quantityToLift: number) {
        const reservation = await Reservation.findByPk(id);
        if (!reservation) throw new Error("RESERVATION_NOT_FOUND");
        
        if (reservation.status !== "active") {
            throw new Error("RESERVATION_NOT_ACTIVE");
        }
        
        if (quantityToLift < 1 || quantityToLift > reservation.quantity) {
            throw new Error("INVALID_QUANTITY");
        }

        // Atualizar a reserva original
        const remainingQuantity = reservation.quantity - quantityToLift;
        
        if (remainingQuantity === 0) {
            // Se levantou todas, apenas marcar como consumed (não criar nova reserva)
            reservation.status = "consumed";
            await reservation.save();
            // Não precisa atualizar a tabela porque a quantity total permanece a mesma (só mudou o status)
        } else {
            // Se levantou parcial, criar nova reserva consumed e reduzir a quantidade da original
            await Reservation.create({
                status: "consumed",
                reservationDate: reservation.reservationDate,
                quantity: quantityToLift,
                mealId: reservation.mealId,
                userId: reservation.userId,
                refeitorioId: reservation.refeitorioId,
            });
            
            // Reduzir a quantidade da reserva original e manter active
            reservation.quantity = remainingQuantity;
            await reservation.save();
            // Não precisa atualizar a tabela porque a quantity total permanece a mesma (só mudou a distribuição)
        }
        
        return reservation;
    }

    async markUnconsumedReservations(targetDate?: Date) {
        const { Op } = require("sequelize");
        
        // Se não for fornecida uma data, usa a data atual
        const dateToCheck = targetDate || new Date();
        const checkDate = new Date(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate());
        
        console.log(`🔍 [DEBUG] Data a verificar: ${checkDate.toISOString()}`);
        console.log(`🔍 [DEBUG] Data formatada: ${checkDate.toLocaleDateString("pt-PT")}`);

        // Buscar reservas ativas cuja data da refeição corresponde à data especificada
        const allActiveReservations = await Reservation.findAll({
            where: {
                status: "active",
            },
            include: [
                {
                    model: Meal,
                    as: "meal",
                    attributes: ["id", "name", "date"],
                },
            ],
        });

        console.log(`🔍 [DEBUG] Total de reservas ativas encontradas: ${allActiveReservations.length}`);

        // Filtrar apenas as que têm data da refeição na data especificada
        const targetReservations = allActiveReservations.filter((reservation: any) => {
            if (!reservation.meal || !reservation.meal.date) {
                console.log(`🔍 [DEBUG] Reserva ${reservation.id} sem meal ou meal.date`);
                return false;
            }
            const mealDate = new Date(reservation.meal.date);
            const mealDateOnly = new Date(mealDate.getFullYear(), mealDate.getMonth(), mealDate.getDate());
            const matches = mealDateOnly.getTime() === checkDate.getTime();
            
            if (matches) {
                console.log(`🔍 [DEBUG] Reserva com o ID ${reservation.id} MATCH! Meal date: ${mealDateOnly.toLocaleDateString("pt-PT")}, Check date: ${checkDate.toLocaleDateString("pt-PT")}`);
            } else {
                console.log(`🔍 [DEBUG] Reserva com o ID${reservation.id} não match. Meal date: ${mealDateOnly.toLocaleDateString("pt-PT")}, Check date: ${checkDate.toLocaleDateString("pt-PT")}`);
            }
            
            return matches;
        });

        console.log(`🔍 [DEBUG] Reservas que correspondem à data: ${targetReservations.length}`);

        let updatedCount = 0;
        for (const reservation of targetReservations) {
            console.log(`🔄 [DEBUG] Marcando reserva ${reservation.id} como "not consumed"`);
            reservation.status = "not consumed";
            await reservation.save();
            updatedCount++;
        }

        const dateStr = checkDate.toLocaleDateString("pt-PT");
        return {
            updated: updatedCount,
            message: `${updatedCount} ids encontrados de refeições marcadas, foram atualizadas como não consumidas na data de ${dateStr}`,
        };
    }
}


