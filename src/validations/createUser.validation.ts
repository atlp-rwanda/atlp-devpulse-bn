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
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>/?]+$')),
  gender: Joi.string().required(),
  telephone: Joi.string().required(),
  country: Joi.string().required(),
  code: Joi.string().required(),
});