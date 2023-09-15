import Joi from 'joi';

interface UserLoggedInput {
  firstname: String;
  lastname: String;
  email: String;
  password: String;
  telephone: String;
  gender: String;
  country: String;
  code: String;
}

export const validateUserLogged = Joi.object<UserLoggedInput>({
  firstname: Joi.string().min(3).message('First name must be at least 3 characters long.'),
  lastname: Joi.string().min(3).message('Last name must be at least 3 characters long.'),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required()
    .messages({
      'string.email': 'Invalid email format. Please provide a valid email address.',
      'any.required': 'Email is required.',
    }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>/?]+$'))
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password cannot exceed 30 characters.',
      'string.pattern.base': 'Password must contain at least one special character.',
    }),
  gender: Joi.string(),
  telephone: Joi.string(),
  country: Joi.string(),
  code: Joi.string().min(2).max(4).message('Code must be between 2 and 4 characters long.'),
});
