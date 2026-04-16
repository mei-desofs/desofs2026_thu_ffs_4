import { Op } from "sequelize";
import { Order } from "../Model/Order";
import { Meal } from "../Model/Meal";
import { AverageReservation } from "../Model/AverageReservation";
import { Reservation } from "../Model/Reservation";
import { User } from "../Model/User";
import { Notification } from "../Model/Notification";
import { NeededProduct } from "../Model/NeededProduct";
import { Product } from "../Model/Product";

const DAYS_BEFORE_CHECK = 4;
export async function adjustOrdersAfterReservations() {
  const pendingOrders = await Order.findAll({
    where: { status: "pending" }
  });

  if (!pendingOrders.length) return;

  const stockManagers = await User.findAll({
    where: { role: "StockManager" }
  });

   let anySuccess = false;

  for (const order of pendingOrders) {
    const neededProduct = await NeededProduct.findByPk(order.neededProductId)
    const meal = await Meal.findByPk(neededProduct?.mealId);
    const product = await Product.findByPk(order.productId);
    if (!meal) continue;

    // Verifica se a refeição está em 0–4 dias
    const today = new Date();
    const mealDate = new Date(meal.date);
    const diffDays = Math.ceil((mealDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0 || diffDays > DAYS_BEFORE_CHECK) continue;

    // Total de reservas reais para esta refeição
    const realReservations = await Reservation.sum("quantity", {
      where: {
        mealId: meal.id,
        status: "active" // ou "pendent", conforme lógica
      }
    });

    const avgReservation = await AverageReservation.findOne({
      where: {
        dishId: meal.dishId,
        typeOfMealId: meal.mealTypeId,
        canteenId: meal.canteenId
      }
    });

    if (!avgReservation) continue;

    // Desvio percentual
    const deviation =
      (realReservations - avgReservation.avgReservations) /
      avgReservation.avgReservations;

    // Atualiza quantity da order
    const adjustedQuantity =
      order.quantity * (realReservations / avgReservation.avgReservations);

    if (adjustedQuantity <= 0) {
      order.quantity = 0;
      order.status = "cancelled";
      await order.save();
      anySuccess = true;
      continue;
    }

    order.quantity = adjustedQuantity;
    order.status = "confirmed"; // passa a confirmed
    await order.save();
    anySuccess = true;

    // 🚨 Notificação se desvio > 10%
    if (Math.abs(deviation) > 0.1) {
      for (const sm of stockManagers) {
        await Notification.create({
          userId: sm.id,
          title: "Desvio significativo nas reservas",
          body: `As reservas reais diferem em ${(deviation * 100).toFixed(
            1
          )}% face ao planeado para o produto ${product?.name} na refeição de ${meal.date.toISOString().split("T")[0]}.`,
          status: "sent"
        });
      }
    }
  }
  if (anySuccess) {
    for (const sm of stockManagers) {
      await Notification.create({
        userId: sm.id,
        title: "Encomendas ajustadas após reservas",
        body: "As encomendas pendentes foram ajustadas com base nas reservas e confirmadas.",
        status: "sent"
      });
    }
  }
}
