const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instructor",
        required: true
    },
    rating: Number,
    reviews: Number,
    students: Number,
}, {
    timestamps: true
})

module.exports = mongoose.model("Course", courseSchema);