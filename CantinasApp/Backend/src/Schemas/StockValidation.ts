import Joi from "joi";

export const createStockSchema = Joi.object({
    updatedDate: Joi.date().greater("now").required(),
    minimumCapacity: Joi.number().integer().positive().required(),
    maximumCapacity: Joi.number().integer().positive().required(),
    currentQuantity: Joi.number().positive().required(),
    batches: Joi.array().items(Joi.number().integer().positive()).required(),
    products: Joi.array()
        .items(
            Joi.object({
                productId: Joi.number().integer().positive().required(),
                quantity: Joi.number().positive().required(),
                unitId: Joi.number().integer().positive().required(),
            })
        )
        .required(),
});
