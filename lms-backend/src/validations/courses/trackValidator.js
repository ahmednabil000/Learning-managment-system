const joi = require("joi");

const trackValidator = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  coverImage: joi.string().allow(null).allow(""),
  duration: joi.number().required(),
  isPublished: joi.boolean().required(),
  instructor: joi.string().required(),
  courses: joi.array().items(joi.string()).required().default([]),
});

module.exports = trackValidator;
