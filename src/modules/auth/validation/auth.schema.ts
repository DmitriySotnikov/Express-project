import Joi from "joi";

/**
 * @description: Auth schema for validation reqquests body.
 * @returns {Joi.ObjectSchema} - Returns an object with the validation rules.
*/

export const authSchema = Joi.object({
  login: Joi
    .string()
    .required()
    .min(3)
    .max(50)
    .messages({
      "string.empty": "Login cannot be empty",
      "any.required": "Login is required",
      "string.min": "Login must be at least 3 characters long",
      "string.max": "Login must be at most 50 characters long",
    }),
  password: Joi
    .string()
    .min(6)
    .required()
    .messages({
      "string.empty": "Password cannot be empty",
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
  deviceId: Joi
    .string()
    .required()
    .min(3)
    .max(50)
    .messages({
      "string.empty": "Device id canmot be empty ",
      "any.required": "Device id is required",
      "string.min": "Device id must be at least 3 characters long",
      "string.max": "Device id must be at most 50 characters long",
    }),
});
