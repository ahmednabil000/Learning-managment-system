const joi = require("joi");

const trackValidator = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  discount: joi.number().min(5).max(100),
  thumbnail: joi.string().allow(null).allow(""),
  isActive: joi.boolean().default(false),
  user: joi.string().required(),
  courses: joi.array().items(joi.string()).default([]),
});

module.exports = trackValidator;
