import Joi from "joi";

export const createMenuSchema = Joi.object({
    menuTypeId: Joi.number().integer().positive().required(),
    initialDate: Joi.date().greater("now").required(),
    finalDate: Joi.date().greater("now").required(),
    meals: Joi.array().items(Joi.number().integer().positive()).required(),
    canteenId: Joi.number().integer().positive().required(),
});
