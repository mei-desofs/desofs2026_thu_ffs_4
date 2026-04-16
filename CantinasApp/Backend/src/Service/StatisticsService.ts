import { RecipeService } from "./RecipeService";
import { IngredientService } from "./IngredientService";
import { BatchService } from "./BatchService";
import { convertQuantity } from "../utils/unitConversion";
import { UnitService } from "./UnitService";
import { UnitEnum } from "../Model/Unit";

const recipeService = new RecipeService();
const ingredientService = new IngredientService();
const batchService = new BatchService();
const unitService = new UnitService();

export class StatisticsService {

    async getBioProductsPercentageForRecipe() {
        const result: { recipe: any; percentage: number }[] = [];

        const recipes = await recipeService.listRecipes();
        if (!recipes?.length) throw new Error("NO_RECIPES_FOUND");

        const batches = await batchService.listBatches();
        if (!batches?.length) throw new Error("NO_BATCHES_FOUND");

        for (const recipe of recipes) {
            let totalQuantity = 0;
            let totalBioQuantity = 0;

            let baseUnit: UnitEnum | null = null;

            for (const ingredientId of recipe.ingredients) {
                const ingredient = await ingredientService.getIngredientById(ingredientId);
                if (!ingredient) throw new Error("INGREDIENT_NOT_FOUND");

                const unit = await unitService.getUnitById(ingredient.unitId);
                if (!unit) throw new Error("UNIT_NOT_FOUND");

                // Definir unidade base
                if (!baseUnit) {
                    if (
                        unit.name === UnitEnum.Kilogram ||
                        unit.name === UnitEnum.Gram
                    ) {
                        baseUnit = UnitEnum.Gram;
                    } else if (
                        unit.name === UnitEnum.Liter ||
                        unit.name === UnitEnum.Milliliter
                    ) {
                        baseUnit = UnitEnum.Milliliter;
                    } else {
                        baseUnit = unit.name;
                    }
                }

                // Bloquear conversões inválidas
                const incompatible =
                    (baseUnit === UnitEnum.Gram &&
                        ![UnitEnum.Gram, UnitEnum.Kilogram].includes(unit.name)) ||
                    (baseUnit === UnitEnum.Milliliter &&
                        ![UnitEnum.Liter, UnitEnum.Milliliter].includes(unit.name));

                if (incompatible) {
                    continue;
                }

                const quantityInBaseUnit =
                    unit.name === baseUnit
                        ? ingredient.quantity
                        : convertQuantity(
                            ingredient.quantity,
                            unit.name,
                            baseUnit
                        );

                totalQuantity += quantityInBaseUnit;

                const isBio = batches.some(
                    batch => batch.productId === ingredient.productId && batch.bio
                );

                if (isBio) {
                    totalBioQuantity += quantityInBaseUnit;
                }
            }
            
            result.push({
                recipe,
                percentage:
                    totalQuantity === 0
                        ? 0
                        : Number(((totalBioQuantity / totalQuantity) * 100).toFixed(2)),
            });
        }

        return result;
    }
}
