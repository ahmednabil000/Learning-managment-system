const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: String,
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
    type: String,
    options: [String],
    correctAnswer: String,
    points: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
