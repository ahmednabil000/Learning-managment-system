const Joi = require("joi");

const paginationValidation = Joi.object({
    page: Joi.number().min(1).default(1),
    pageCount: Joi.number().min(1).default(10),
    search: Joi.string().default("").allow(""),
});

module.exports = paginationValidation;