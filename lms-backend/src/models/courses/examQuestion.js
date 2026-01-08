const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const examQuestionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    exam: {
      type: String,
      ref: "Exam",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["multiple-choice", "true-false", "short-answer"],
      default: "multiple-choice",
    },
    options: [String],
    correctAnswer: String,
    points: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExamQuestion", examQuestionSchema);
