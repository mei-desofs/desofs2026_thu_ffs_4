import Joi from "joi";

export const createBatchSchema = Joi.object({
    expirationDate: Joi.date().greater("now").required(),
    productId: Joi.number().integer().positive().required(),
    quantity: Joi.number().positive().required(),
    unitId: Joi.number().integer().positive().required(),
    bio: Joi.boolean().required(),
});
