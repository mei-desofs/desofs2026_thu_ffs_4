import {StatisticsService} from "../Service/StatisticsService";
import {Request, Response} from "express";

const service = new StatisticsService()

export class StatisticsController {

    static async getBioProductsPercentageForRecipe(req: Request, res: Response) {
        try {
            const result = await service.getBioProductsPercentageForRecipe();
            res.json(result);
        } catch (err: any) {
            switch (err.message) {
                case "RECIPE_NOT_FOUND":
                    return res.status(404).json({ error: "Recipe not found" });
                case "INGREDIENT_NOT_FOUND":
                    return res.status(404).json({ error: "Ingredient not found" });
                case "NO_BATCHES_FOUND":
                    return res.status(404).json({ error: "No batches found" });
            }
        }
    }
}
