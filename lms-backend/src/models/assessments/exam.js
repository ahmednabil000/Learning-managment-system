const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const examSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
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
