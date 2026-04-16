import {Recipe} from "../Model/Recipe";
import {Ingredient} from "../Model/Ingredient";

export class RecipeService {

    async createRecipe(data: {
        ingredients: number[];
        description: string;
    }) {
        // validar existência de Id's
        for (const ingredients of data.ingredients) {
            const ingredient = await Ingredient.findByPk(ingredients);
            if (!ingredient) throw new Error("INGREDIENT_NOT_FOUND");
        }

        return await Recipe.create(data)
    }

    async listRecipes() {
        return await Recipe.findAll();
    }

    async getRecipeById(id: number) {
        const recipe = await Recipe.findByPk(id);
        if (!recipe) throw new Error("RECIPE_NOT_FOUND");
        return recipe;
    }
}