const Joi = require("joi");

const examAttemptValidator = Joi.object({
  exam: Joi.string().required(),
  student: Joi.string().required(),
  answers: Joi.array().items(Joi.string()).required(),
  totalPoints: Joi.number().min(0).optional(),
});

module.exports = examAttemptValidator;
