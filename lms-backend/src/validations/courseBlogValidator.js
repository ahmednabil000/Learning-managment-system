const Joi = require("joi");

const courseBlogValidator = Joi.object({
  course: Joi.string().required(),
  lecture: Joi.string().required(),
  title: Joi.string().required().min(3).max(100),
  content: Joi.string().required().min(10).max(1000),
});

module.exports = courseBlogValidator;
