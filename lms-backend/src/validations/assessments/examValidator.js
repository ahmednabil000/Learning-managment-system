const Joi = require("joi");

const examValidator = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  questions: Joi.array().items(Joi.string()).optional(),
  duration: Joi.number().min(30).required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required(),
  isPublished: Joi.boolean().default(false),
  instructor: Joi.string().required(),
  course: Joi.string().required(),
  totalPoints: Joi.number().min(0).required(),
});

module.exports = examValidator;
