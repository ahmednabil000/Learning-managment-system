const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const answerSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    question: { type: String, ref: "Question" },
    assignmentAttempt: {
      type: String,
      ref: "AssignmentAttempt",
    },
    examAttempt: {
      type: String,
      ref: "ExamAttempt",
    },
    type: String,
    value: String,
    isCorrect: Boolean,
    submittedBy: { type: String, ref: "Student" },
    points: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Answer", answerSchema);
