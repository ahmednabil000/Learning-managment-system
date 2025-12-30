const Joi = require("joi");

const courseCommentSchema = Joi.object({
  user: Joi.string().required(),
  course: Joi.string().required(),
  rate: Joi.number().min(1).max(5).required(),
  content: Joi.string().min(3).max(500).required(),
});

module.exports.courseCommentSchema = courseCommentSchema;
