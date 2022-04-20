import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .trim()
    .required(),
  password: Joi.string().trim().min(10).required(),
  firstname: Joi.string().trim().required(),
  lastname: Joi.string().trim().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .trim()
    .required(),
  password: Joi.string().trim().min(10).required(),
});
