const mongoose = require("mongoose");

const examAttemptSchema = new mongoose.Schema(
  {
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    totalPoints: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExamAttempt", examAttemptSchema);
