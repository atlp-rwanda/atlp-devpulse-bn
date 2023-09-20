import Joi from "joi";

interface LoginInput {
  email: String;
  password: String;
}

export const validateLogin = Joi.object<LoginInput>({
  email: Joi.string()
    .required(),
  password: Joi.string()
    .required(),
});
