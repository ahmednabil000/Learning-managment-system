const Joi = require("joi");

exports.courseTagSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
});
