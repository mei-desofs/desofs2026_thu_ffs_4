import Joi from "joi";

export const createIngredientSchema = Joi.object({
    productId: Joi.number().integer().positive().required(),
    quantity: Joi.number().positive().required(),
    unitId: Joi.number().integer().positive().required()
});
