const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const examAttemptSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    exam: {
      type: String,
      ref: "Exam",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["in-progress", "ended"],
      default: "in-progress",
    },
    answers: [
      {
        question: {
          type: String,
          ref: "ExamQuestion",
        },
        answer: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExamAttempt", examAttemptSchema);
