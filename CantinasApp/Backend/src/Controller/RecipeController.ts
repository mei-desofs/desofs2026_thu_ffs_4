import {RecipeService} from "../Service/RecipeService";
import {Request, Response} from "express";
import {createRecipeSchema} from "../Schemas/RecipeValidation";

const service = new RecipeService()

export class RecipeController {

    static async createRecipe(req: Request, res: Response) {
        const { error } = createRecipeSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });

        try {
            const result = await service.createRecipe(req.body);
            res.json(result);
        } catch (err: any) {
            switch (err.message) {
                case "INGREDIENT_NOT_FOUND":
                    return res.status(404).json({ error: "Ingredient not found" });
            }
        }
    }

    static async listRecipes(req: Request, res: Response) {
        const result = await service.listRecipes();
        res.json(result);
    }

    static async getRecipe(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

        try {
            const recipe = await service.getRecipeById(id);
            res.json(recipe);
        } catch (err: any) {
            if (err.message === "RECIPE_NOT_FOUND")
                return res.status(404).json({ error: "Recipe not found" });
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
