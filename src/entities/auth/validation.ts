import Joi from 'joi';
import { passwordLength } from './constants';

const emailValidation = {
  minDomainSegments: 2,
  tlds: { allow: ['com', 'net'] },
};

export const registerSchema = Joi.object({
  email: Joi.string().email(emailValidation).trim().required(),
  password: Joi.string().trim().min(passwordLength).required(),
  firstname: Joi.string().trim().required(),
  lastname: Joi.string().trim().required(),
  role: Joi.string().trim(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email(emailValidation).trim().required(),
  password: Joi.string().trim().min(passwordLength).required(),
});
