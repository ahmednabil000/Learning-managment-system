const Joi = require("joi");

const userValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  fullName: Joi.string().min(3).max(20).required(),
});

module.exports = userValidator;
