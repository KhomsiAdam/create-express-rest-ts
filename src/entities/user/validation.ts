import Joi from 'joi';

export const userSchema = Joi.object({
  firstname: Joi.string().trim(),
  lastname: Joi.string().trim(),
});
