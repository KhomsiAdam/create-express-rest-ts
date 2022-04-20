import Joi from 'joi';

export const adminSchema = Joi.object({
  firstname: Joi.string().trim(),
  lastname: Joi.string().trim(),
});
