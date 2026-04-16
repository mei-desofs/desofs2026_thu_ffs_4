import Joi from "joi";

export const createRecipeSchema = Joi.object({
    ingredients: Joi.array().items(Joi.number().integer().positive()).required(),
    description: Joi.string().min(10).max(1000).required(),
});
