import {Product} from "../Model/Product";
import {Unit} from "../Model/Unit";
import {Ingredient} from "../Model/Ingredient";
import {Batch} from "../Model/Batch";

export class IngredientService {

    async createIngredient(data: {
        productId: number;
        quantity: number;
        unitId: number;
    }) {
        // validar existência de Id's
        const product = await Product.findByPk(data.productId);
        if (!product) throw new Error("PRODUCT_NOT_FOUND");

        const unit = await Unit.findByPk(data.unitId);
        if (!unit) throw new Error("UNIT_NOT_FOUND");

        const existingIngredient = await Ingredient.findOne({
            where: {
                productId: data.productId,
                quantity: data.quantity,
                unitId: data.unitId,
            },
        });

        if (existingIngredient) {
            throw new Error("INGREDIENT_ALREADY_EXISTS");
        }

        return await Ingredient.create(data)
    }

    async listIngredients() {
        return await Ingredient.findAll();
    }

    async getIngredientById(id: number) {
        const ingredient = await Ingredient.findByPk(id);
        if (!ingredient) throw new Error("INGREDIENT_NOT_FOUND");
        return ingredient;
    }
}