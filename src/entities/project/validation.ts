import Joi from 'joi';

export const createProjectSchema = Joi.object({
  name: Joi.string().trim().required(),
  category: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
});

export const updateProjectSchema = Joi.object({
  name: Joi.string().trim(),
  category: Joi.string().trim(),
  description: Joi.string().trim(),
  issues: Joi.array().items(Joi.string()),
  users: Joi.array().items(Joi.string()),
});
