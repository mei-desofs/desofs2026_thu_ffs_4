import Joi from "joi";

export const createMealSchema = Joi.object({
    mealTypeId: Joi.number().integer().positive().required(),
    name: Joi.string().min(2).max(100).required(),
    date: Joi.date().greater("now").required(),
    dishId: Joi.number().integer().positive().required(),
    canteenId: Joi.number().integer().positive().required(),
    refeitorioId: Joi.number().integer().positive().required(),
});
