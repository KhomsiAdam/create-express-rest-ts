import Joi from 'joi';

export const createIssueSchema = Joi.object({
  title: Joi.string().trim().required(),
  type: Joi.string().trim().required(),
  status: Joi.string().trim().required(),
  priority: Joi.number().required(),
  reporter: Joi.string().hex().length(24).required(),
  project: Joi.string().hex().length(24).required(),
});

export const updateIssueSchema = Joi.object({
  title: Joi.string().trim(),
  type: Joi.string().trim(),
  status: Joi.string().trim(),
  priority: Joi.number(),
  reporter: Joi.string().hex().length(24),
  project: Joi.string().hex().length(24),
  estimate: Joi.number(),
  timeSpent: Joi.number(),
  timeRemaining: Joi.number(),
  comments: Joi.array().items(Joi.string()),
  users: Joi.array().items(Joi.string()),
});
