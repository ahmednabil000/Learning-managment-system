const joi = require("joi");

const courseValidator = joi.object({
  title: joi.string().min(5).max(50).required(),
  description: joi.string().min(10).max(700).required(),
  imageUrl: joi.string(),
  price: joi.number().required(),
  tag: joi.string().required(),
  level: joi
    .string()
    .valid("beginner", "intermediate", "advanced", "expert")
    .required(),
  learning: joi.array().items(joi.string()).optional(),
  requirements: joi.array().items(joi.string()).optional(),
});

module.exports = courseValidator;
