import {MealType} from "../Model/MealType";
import {Dish} from "../Model/Dish";
import {Meal} from "../Model/Meal";
import {Ingredient} from "../Model/Ingredient";
import {Canteen} from "../Model/Canteen";
import {Refeitorio} from "../Model/Refeitorio";

export class MealService {

    async createMeal(data: {
        mealTypeId: number;
        name: string;
        date: Date;
        dishId: number;
        canteenId: number;
        refeitorioId: number;
    }) {
        // validar existência de Id's
        const mealType = await MealType.findByPk(data.mealTypeId);
        if (!mealType) throw new Error("MEAL_TYPE_NOT_FOUND");

        const dish = await Dish.findByPk(data.dishId);
        if (!dish) throw new Error("DISH_NOT_FOUND");

        const canteen = await Canteen.findByPk(data.canteenId);
        if (!canteen) throw new Error("CANTEEN_NOT_FOUND");

        const refeitorio = await Refeitorio.findByPk(data.refeitorioId);
        if (!refeitorio) throw new Error("REFEITORIO_NOT_FOUND");

        return await Meal.create(data)
    }

    async listMeals() {
        return await Meal.findAll();
    }

    async getMealById(id: number) {
        const meal = await Meal.findByPk(id);
        if (!meal) throw new Error("MEAL_NOT_FOUND");
        return meal;
    }

    async getCanteenStatistics(canteenId: number, filter?: { date?: string }) {
        const { Op } = require("sequelize");
        
        const whereClause: any = {
            canteenId: canteenId
        };

        // Filtrar por data se fornecida
        if (filter?.date) {
            const filterDate = new Date(filter.date);
            const startOfDay = new Date(filterDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(filterDate);
            endOfDay.setHours(23, 59, 59, 999);
            
            whereClause.date = {
                [Op.between]: [startOfDay, endOfDay]
            };
        }

        const totalMealsProduced = await Meal.count({
            where: whereClause
        });

        return {
            totalMealsProduced
        };
    }
}