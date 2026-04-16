import { Op } from "sequelize";
import { NeededProduct } from "../Model/NeededProduct";
import { SupplierOrder } from "../Model/SupplierOrder";
import { FarmerProduct } from "../Model/FarmerProducts";
import { Order } from "../Model/Order";
import { Notification } from "../Model/Notification";
import { User } from "../Model/User";
import { getWeekFromDate, addDays } from "./date";
import { Product } from "../Model/Product";

// Retorna a maior unidade para encomenda
function getLargestUnit(unit: string) {
  if (unit === "g") return "kg";
  if (unit === "ml") return "l";
  return unit; // unit ou já é kg/l
}

// Converte quantidade entre unidades compatíveis
function convertQuantity(quantity: number, fromUnit: string, toUnit: string) {
  if (fromUnit === toUnit) return quantity;

  // Peso
  if (fromUnit === "g" && toUnit === "kg") return quantity / 1000;
  if (fromUnit === "kg" && toUnit === "g") return quantity * 1000;

  // Volume
  if (fromUnit === "ml" && toUnit === "l") return quantity / 1000;
  if (fromUnit === "l" && toUnit === "ml") return quantity * 1000;

  return quantity; // unit ou incompatível
}

export async function generateOrdersFromNeededProducts() {
  const neededProducts = await NeededProduct.findAll({
    where: { date: { [Op.gte]: new Date() }, status: "needed" }
  });

  if (neededProducts.length === 0) return;

  // Usar a mesma week para todos os needed products
  const firstDate = new Date(neededProducts[0].date);
  let week = getWeekFromDate(firstDate);
  week = ((week - 1) % 52) + 1;

  const stockManagers = await User.findAll({ where: { role: "StockManager" } });
  const allSuppliers = await SupplierOrder.findAll({ order: [["position", "ASC"]] });
  // filtrar para os que nao tem user status quarantine
  const suppliers = [];
  for (const supplier of allSuppliers) {
    const user = await User.findByPk(supplier.supplierId);
    if (user && user.status !== "quarantine") {
      console.log(`Including supplier ${supplier.supplierId} with status ${user.status}`);
      suppliers.push(supplier);
    }
  }

  let anySuccess = false;

  const suppliersWithOrders = new Set<number>();
  for (const np of neededProducts) {
    const mealDate = new Date(np.date);
    const targetUnit = getLargestUnit(np.unit.toString());
    let remainingQuantity = convertQuantity(np.quantity, np.unit.toString(), targetUnit);

    const product = await Product.findByPk(np.productId);

    const farmersForProduct = await FarmerProduct.findAll({
      where: { productId: np.productId, week }
    });

    // Mostrar stocks convertidos
    for (const fp of farmersForProduct) {
      const convertedStock = convertQuantity(fp.quantity, fp.unit, targetUnit);
      console.log(`   Farmer ${fp.userId} | Stock: ${fp.quantity} ${fp.unit} | Converted for order: ${convertedStock.toFixed(2)} ${targetUnit}`);
    }

    for (const supplier of suppliers) {
      if (remainingQuantity <= 0) break;

      const farmerProduct = farmersForProduct.find(fp => fp.userId === supplier.supplierId);
      if (!farmerProduct) continue;

      const availableQty = convertQuantity(farmerProduct.quantity, farmerProduct.unit, targetUnit);
      if (availableQty <= 0) continue;

      const allocatedQuantity = Math.min(availableQty, remainingQuantity);
      const allocatedInFarmerUnit = convertQuantity(allocatedQuantity, targetUnit, farmerProduct.unit);

      const existingOrder = await Order.findOne({
        where: {
          userId: supplier.supplierId,
          neededProductId: np.id,
          status: "pending" // opcional: só considera pendentes
        }
      });

      if (existingOrder) {
        // Opcional: atualizar quantidade se necessário
        existingOrder.quantity = Math.max(existingOrder.quantity, allocatedQuantity);
        await existingOrder.save();
      } else {
        await Order.create({
          userId: supplier.supplierId,
          neededProductId: np.id,
          productId: np.productId,
          unit: targetUnit,
          quantity: allocatedQuantity,
          status: "pending",
          date: addDays(mealDate, -2),
          canteenId: np.canteenId
        });
      }

      suppliersWithOrders.add(supplier.supplierId);

      farmerProduct.quantity -= allocatedInFarmerUnit;
      await farmerProduct.save();

      remainingQuantity -= allocatedQuantity;

      console.log(`   Supplier ${supplier.supplierId} | Allocated: ${allocatedQuantity.toFixed(2)} ${targetUnit} | Remaining needed: ${remainingQuantity.toFixed(2)} ${targetUnit}`);
    }

    // Notificação de falha
    if (remainingQuantity > 0) {
      for (const sm of stockManagers) {
        await Notification.create({
          userId: sm.id,
          title: "Falta de stock para encomenda",
          body: `Não foi possível encomendar quantidade suficiente do produto ${product?.name} para a refeição de ${mealDate.toISOString().split('T')[0]}.`,
          status: "sent"
        });
      }
    } else {
      anySuccess = true;
      // Atualizar status do NeededProduct para "ordered"
      np.status = "ordered";
      await np.save();
    }

  }

  // Notificação de sucesso única
  if (anySuccess) {
    for (const sm of stockManagers) {
      await Notification.create({
        userId: sm.id,
        title: "Encomendas enviadas aos fornecedores",
        body: `Foram disponibilizadas previsões de entregas aos fornecedores para os menus futuros.`,
        status: "sent"
      });
    }

    for (const supplierId of suppliersWithOrders) {
      await Notification.create({
        userId: supplierId,
        title: "Nova encomenda pendente",
        body: "Tem novas encomendas provisórias para as próximas semanas. Por favor, reveja-as na sua área de encomendas.",
        status: "sent"
      });
    }
  }
}
