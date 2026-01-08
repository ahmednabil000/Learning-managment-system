const Joi = require("joi");

const examValidator = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().optional().max(500),
  questions: Joi.array().items(Joi.string()).optional(),
  duration: Joi.number().valid(15, 30, 60, 90, 120).required(),
  startDate: Joi.date().required(),
  instructor: Joi.string().required(),
  course: Joi.string().required(),
});

module.exports = examValidator;
