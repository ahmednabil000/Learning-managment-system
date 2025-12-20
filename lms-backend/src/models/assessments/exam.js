const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: String,
    duration: Number,
    startDate: Date,
    endDate: Date,
    isPublished: Boolean,
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    totalPoints: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
