const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const examAttemptSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    totalPoints: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExamAttempt", examAttemptSchema);
