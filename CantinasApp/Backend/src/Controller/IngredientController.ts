import {IngredientService} from "../Service/IngredientService";
import {Request, Response} from "express";
import {createIngredientSchema} from "../Schemas/IngredientValidation";

const service = new IngredientService()

export class IngredientController {

    static async createIngredient(req: Request, res: Response) {
        const { error } = createIngredientSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });

        try {
            const result = await service.createIngredient(req.body);
            res.json(result);
        } catch (err: any) {
            switch (err.message) {
                case "PRODUCT_NOT_FOUND":
                    return res.status(404).json({ error: "Product not found" });
                case "UNIT_NOT_FOUND":
                    return res.status(404).json({ error: "Unit not found" });
                case "INGREDIENT_ALREADY_EXISTS":
                    return res.status(404).json({ error: "Ingredient already exists" });
            }
        }
    }

    static async listIngredients(req: Request, res: Response) {
        const result = await service.listIngredients();
        res.json(result);
    }

    static async getIngredient(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

        try {
            const ingredient = await service.getIngredientById(id);
            res.json(ingredient);
        } catch (err: any) {
            if (err.message === "INGREDIENT_NOT_FOUND")
                return res.status(404).json({ error: "Ingredient not found" });
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
