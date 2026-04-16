import {DishService} from "../Service/DishService";
import {Request, Response} from "express";
import {createDishSchema} from "../Schemas/DishValidation";

const service = new DishService()

export class DishController {

    static async createDish(req: Request, res: Response) {
        const { error } = createDishSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });

        try {
            const result = await service.createDish(req.body);
            res.json(result);
        } catch (err: any) {
            console.log("ERR", err);
            switch (err.message) {
                case "DISH_TYPE_NOT_FOUND":
                    return res.status(404).json({ error: "Dish type not found" });
                case "RECIPE_NOT_FOUND":
                    return res.status(404).json({ error: "Recipe not found" });
            }
        }
    }

    static async listDishes(req: Request, res: Response) {
        const result = await service.listDishes();
        res.json(result);
    }

    static async getDish(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

        try {
            const dish = await service.getDishById(id);
            res.json(dish);
        } catch (err: any) {
            if (err.message === "DISH_NOT_FOUND")
                return res.status(404).json({ error: "Dish not found" });
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getDishByRecipe(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

        try {
            const dish = await service.getDishByRecipeId(id);
            res.json(dish);
        } catch (err: any) {
            if (err.message === "DISH_NOT_FOUND")
                return res.status(404).json({ error: "Dish not found" });
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getDishRecommendations(req: Request, res: Response) {
        try {
            const dishes = await service.getDishRecommendations(new Date(req.params.date));
            res.json(dishes);
        } catch (err: any) {
            switch (err.message) {
                case "RECIPE_NOT_FOUND":
                    return res.status(404).json({ error: "Recipe not found" });
                case "INGREDIENT_NOT_FOUND":
                    return res.status(404).json({ error: "Ingredient not found" });
            }
        }
    }
}
