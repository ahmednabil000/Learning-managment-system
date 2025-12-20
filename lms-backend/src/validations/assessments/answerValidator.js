const Joi = require("joi");

const answerValidator = Joi.object({
  question: Joi.string().required(),
  submittedAsignment: Joi.string().optional(),
  value: Joi.string().required(),
  isCorrect: Joi.boolean().optional(),
  points: Joi.number().min(0).optional(),
});

module.exports = answerValidator;
