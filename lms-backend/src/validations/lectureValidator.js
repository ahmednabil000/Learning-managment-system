const Joi = require("joi");

const lectureSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  courseId: Joi.string().required(),
  order: Joi.number().required(),
});

module.exports = lectureSchema;
