import {DishType} from "../Model/DishType";
import {Recipe} from "../Model/Recipe";
import {Dish} from "../Model/Dish";
import {IngredientService} from "./IngredientService";
import {FarmerProductService} from "./FarmerProductsService";
import { ApplicationService } from "./ApplicationService";
import { UserService } from "./UserService";
import {getWeekFromDate, addDays} from "../utils/date"

const ingredientService = new IngredientService();
const farmerProductsService = new FarmerProductService();
const applicationService = new ApplicationService();

export class DishService {

    async createDish(data: {
        dishTypeId: number;
        name: string;
        recipeId: number;
        mainProductsId: number[];
    }) {
        // validar existência de Id's
        const dishType = await DishType.findByPk(data.dishTypeId);
        if (!dishType) throw new Error("DISH_TYPE_NOT_FOUND");

        const recipe = await Recipe.findByPk(data.recipeId);
        if (!recipe) throw new Error("RECIPE_NOT_FOUND");

        return await Dish.create(data)
    }

    async listDishes() {
        return await Dish.findAll();
    }

    async getDishById(id: number) {
        const dish = await Dish.findByPk(id);
        if (!dish) throw new Error("DISH_NOT_FOUND");
        return dish;
    }

    async getDishByRecipeId(recipeId: number) {
        const dish = await Dish.findOne({
            where: { recipeId }
        });
        if (!dish) throw new Error("DISH_NOT_FOUND");
        return dish;
    }

    async getDishRecommendations(date: Date) {
        const dishes = await Dish.findAll();
        const farmerProducts = await farmerProductsService.listFarmerProducts();
        const week = await getWeekFromDate(date);

        const recommendationList: { dish: any; score: number }[] = [];

        for (const dish of dishes) {
            const recipe = await Recipe.findByPk(dish.recipeId);
            if (!recipe) throw new Error("RECIPE_NOT_FOUND");

            let productsCounter = 0;

            for (const ingredientId of recipe.ingredients) {
                const ingredient = await ingredientService.getIngredientById(ingredientId);
                if (!ingredient) throw new Error("INGREDIENT_NOT_FOUND");

                for (const farmerProduct of farmerProducts) {
                    const user = await UserService.findById(farmerProduct.userId);
                    if (!user) throw new Error("USER_NOT_FOUND");

                    if (user.role === "Supplier" && user.status === "enabled") {
                        if (ingredient.productId === farmerProduct.productId && farmerProduct.week === week) {
                            productsCounter++;
                            break;
                        }
                    }
                }
            }

            recommendationList.push({
                dish: dish,
                score: productsCounter,
            });
        }

        recommendationList.sort((a, b) => b.score - a.score);

        return recommendationList;
    }

}