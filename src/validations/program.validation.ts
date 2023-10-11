import Joi from 'joi';

interface ProgramInput {
  title: String;
  description: String;
  mainObjective: String;
  requirements: [];
  modeOfExecution: String;
  duration: String;
}
interface UpdateProgramInput {
  _id: String;
  title: String;
  description: String;
  mainObjective: String;
  requirements: [];
  modeOfExecution: String;
  duration: String;
}
export const validateProgram = Joi.object<ProgramInput>({
  title: Joi.string().required(),
  description: Joi.string().required(),
  mainObjective: Joi.string().required(),
  requirements: Joi.array().required(),
  modeOfExecution: Joi.string().required(),
  duration: Joi.string().required(),
});

export const validateUpdateProgram = Joi.object<UpdateProgramInput>({
  _id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  mainObjective: Joi.string().required(),
  requirements: Joi.array().required(),
  modeOfExecution: Joi.string().required(),
  duration: Joi.string().required(),
});
