const mongoose = require("mongoose");

const courseVideoSchema = new mongoose.Schema({
    title: String,
    courseSection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseSection",
        required: true
    },
    url: String,
    order: Number,
    duration: Number,
}, {
    timestamps: true
})

module.exports = mongoose.model("CourseVideo", courseVideoSchema);
