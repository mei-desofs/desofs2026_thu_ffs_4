import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  typeId: Joi.number().integer().positive().required(),
  unitId: Joi.number().integer().positive().required(),
  nutrition: Joi.array()
    .items(
      Joi.object({
        typeId: Joi.number().integer().positive().required(),
        percentage: Joi.number().min(0).max(100).required()
      })
    )
    .required(),
  allergens: Joi.array().items(Joi.number().integer().positive()).required()
});
