const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const examSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    title: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      ref: "User",
      required: true,
    },
    description: String,
    course: {
      type: String,
      ref: "Course",
      required: true,
    },
    questions: [
      {
        type: String,
        ref: "ExamQuestion",
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // Duration in minutes
      enum: [15, 30, 60, 90, 120],
      required: true,
    },
    status: {
      type: String,
      enum: ["not-started", "started", "ended"],
      default: "not-started",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
