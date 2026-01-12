const Joi = require("joi");

const assignmentValidator = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  lecture: Joi.string().required(),
  questions: Joi.array().items(Joi.string()).optional(),
});

module.exports = assignmentValidator;
