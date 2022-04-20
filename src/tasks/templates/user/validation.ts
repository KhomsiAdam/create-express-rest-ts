import Joi from 'joi';

export const {{lowercaseName}}Schema = Joi.object({
  firstname: Joi.string().trim(),
  lastname: Joi.string().trim(),
});
