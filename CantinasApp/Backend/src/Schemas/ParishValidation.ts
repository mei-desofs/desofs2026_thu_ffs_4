import Joi from "joi";

export const createParishSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
});