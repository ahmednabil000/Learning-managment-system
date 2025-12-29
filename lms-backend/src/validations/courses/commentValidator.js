const Joi = require("joi");

const commentValidator = Joi.object({
  content: Joi.string().min(3).max(500).required(),
  lecture: Joi.string().required(),
  parentComment: Joi.string().allow(null).default(null).optional(),
});

const updateCommentValidator = Joi.object({
  content: Joi.string().min(3).max(500).required(),
});
module.exports = { commentValidator, updateCommentValidator };
