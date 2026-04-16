import { Op } from "sequelize";
import { Menu } from "../Model/Menu";
import { Meal } from "../Model/Meal";
import { Dish } from "../Model/Dish";
import { Recipe } from "../Model/Recipe";
import { Ingredient } from "../Model/Ingredient";
import { AverageReservation } from "../Model/AverageReservation";
import { Stock } from "../Model/Stock";
import { Batch } from "../Model/Batch";
import { NeededProduct } from "../Model/NeededProduct";
import { Unit } from "../Model/Unit";
import { convertQuantity } from "./unitConversion";

export async function generateNeededProductsFromPublishedMenus() {
  const menus = await Menu.findAll({
    where: { status: { [Op.or]: ["published", "aproved"] } }
  });

  for (const menu of menus) {
    const meals = await Meal.findAll({
      where: { id: { [Op.in]: menu.meals } }
    });

    for (const meal of meals) {
      const dish = await Dish.findByPk(meal.dishId);
      if (!dish) continue;

      const recipe = await Recipe.findByPk(dish.recipeId);
      if (!recipe || !recipe.ingredients?.length) continue;

      const ingredients = await Ingredient.findAll({
        where: { id: { [Op.in]: recipe.ingredients } }
      });

      const avgReservation = await AverageReservation.findOne({
        where: {
          dishId: dish.id,
          typeOfMealId: meal.mealTypeId,
          canteenId: menu.canteenId
        }
      });
      if (!avgReservation) continue;

      for (const ingredient of ingredients) {
        const ingredientUnit = await Unit.findByPk(ingredient.unitId);
        if (!ingredientUnit) continue;

        const neededQuantity =
          ingredient.quantity * avgReservation.avgReservations;

        let availableQuantity = 0;
        const stocks = await Stock.findAll();

        for (const stock of stocks) {
          if (!stock.batches?.length) continue;
          if (stock.batches?.length) continue;
          const batches = await Batch.findAll({
            where: {
              id: { [Op.in]: stock.batches },
              productId: ingredient.productId,
              expirationDate: { [Op.gte]: meal.date }
            }
          });

          for (const batch of batches) {
            const batchUnit = await Unit.findByPk(batch.unitId);
            if (!batchUnit) continue;

            const convertedQty = convertQuantity(
              batch.quantity,
              batchUnit.name,
              ingredientUnit.name
            );

            availableQuantity += convertedQty;
          }
        }

        const quantityToOrder = neededQuantity - availableQuantity;

        if (quantityToOrder > 0) {
          // 🔹 Verificar se já existe NeededProduct
          const existing = await NeededProduct.findOne({
            where: {
              productId: ingredient.productId,
              date: meal.date,
              unit: ingredientUnit.name
            }
          });

          if (existing) {
            // Atualizar quantidade (opcional)
            existing.quantity = Math.max(existing.quantity, quantityToOrder);
            await existing.save();
          } else {
            await NeededProduct.create({
              date: meal.date,
              productId: ingredient.productId,
              mealId: meal.id,
              unit: ingredientUnit.name,
              quantity: quantityToOrder,
              canteenId: menu.canteenId,
              status: "needed"
            });
          }
        }
      }
    }
  }
}
