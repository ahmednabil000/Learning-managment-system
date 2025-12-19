const Joi = require("joi");

const lessonSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  lectureId: Joi.string().required(),
  order: Joi.number().required(),
  duration: Joi.number().required(),
  videoUrl: Joi.string().required(),
});

module.exports = lessonSchema;
