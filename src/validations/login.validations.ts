import Joi from "joi";

interface LoginInput {
  email: String;
  password: String;
}

export const validateLogin = Joi.object<LoginInput>({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:'\",.<>/?]+$")),
});
