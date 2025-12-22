const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const answerSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    assignmentAttempt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssignmentAttempt",
    },
    examAttempt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamAttempt",
    },
    type: String,
    value: String,
    isCorrect: Boolean,
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    points: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Answer", answerSchema);
