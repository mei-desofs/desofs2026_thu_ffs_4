import Joi from "joi";

export const createDishSchema = Joi.object({
    dishTypeId: Joi.number().integer().positive().required(),
    name: Joi.string().min(2).max(100).required(),
    recipeId: Joi.number().integer().positive().required(),
    mainProductsId: Joi.array().items(Joi.number().integer().positive()).required(),
});
