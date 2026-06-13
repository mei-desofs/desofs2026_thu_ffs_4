import Joi from "joi";

export const registerUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string()
    .valid(
      "Supplier",
      "NetworkManager",
      "Nutritionist",
      "Student",
      "Visitor",
      "NursingHome",
      "RefectoryStaff",
      "StockManager",
      "CanteenManager",
      "RefectoryManager",
    )
    .required(),
  refeitorioId: Joi.number().integer().positive(),
  canteenId: Joi.number().integer().positive(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(1).required(),
  newPassword: Joi.string().min(8).max(128).required(),
});

export const verifyEmailSchema = Joi.object({
  token: Joi.string().required(),
});

export const requestPasswordResetSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).max(128).required(),
});
