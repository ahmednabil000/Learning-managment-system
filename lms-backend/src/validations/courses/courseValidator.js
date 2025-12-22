const joi = require("joi");

const courseValidator = joi.object({
  title: joi.string().min(5).max(50).required(),
  description: joi.string().min(10).max(300).required(),
  imageUrl: joi.string(),
  price: joi.number().required(),
  tag: joi.string().required(),
});

module.exports = courseValidator;
