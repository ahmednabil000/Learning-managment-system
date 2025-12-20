const Joi = require("joi");

const questionValidator = Joi.object({
  title: Joi.string().min(5).max(500).required(),
  assignment: Joi.string().optional(),
  exam: Joi.string().optional(),
  type: Joi.string()
    .valid("multiple-choice", "true-false", "short-answer", "essay")
    .required(),
  options: Joi.array().items(Joi.string()).optional(),
  correctAnswer: Joi.string().required(),
  points: Joi.number().min(0).required(),
}).or("assignment", "exam");

module.exports = questionValidator;
