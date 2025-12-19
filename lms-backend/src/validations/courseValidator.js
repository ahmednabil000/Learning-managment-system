const joi = require("joi");

const courseValidator = joi.object({
    title: joi.string().min(5).max(50).required(),
    description:joi.string().min(10).max(300).required(),
    imageUrl:joi.string(),
    price:joi.number().required(),
    instructor:joi.string().required(),
});

module.exports = courseValidator;
//   title: String,
//     description: String,
//     price: Number,
//     imageUrl: String,
//     instructor: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Instructor",
//         required: true
//     },
//     rating: Number,
//     reviews: Number,
//     students: Number,