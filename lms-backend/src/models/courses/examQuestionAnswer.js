const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const examQuestionAnswerSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    examQuestion: {
      type: String,
      ref: "ExamQuestion",
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    examAttempt: {
      type: String,
      ref: "ExamAttempt",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExamQuestionAnswer", examQuestionAnswerSchema);
