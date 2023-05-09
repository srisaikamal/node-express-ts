import Joi from 'joi';

export const usernameValidator = Joi.string()
  .required()
  .min(3)
  .max(30)
  .label('Username');

export const firstNameValidator = Joi.string()
  .required()
  .min(3)
  .max(30)
  .pattern(/^[^0-9]+$/, { name: 'No numbers' });

export const passwordValidator = Joi.string().required().min(6);

export const register = Joi.object({
  username: usernameValidator,
  firstName: firstNameValidator.label('First name'),
  lastName: Joi.string()
    .optional()
    .max(30)
    .pattern(/^[^0-9]+$/, { name: 'No numbers' })
    .label('Last name'),
  mobile: Joi.string()
    .optional()
    .length(10)
    .pattern(/^[0-9]+$/),
  email: Joi.string().optional().min(5).email().label('Email'),
  password: passwordValidator,
  stores: Joi.array().items(Joi.string()).optional(),
  role: Joi.string().required(),
});

export const login = Joi.object({
  username: usernameValidator,
  password: passwordValidator,
});
