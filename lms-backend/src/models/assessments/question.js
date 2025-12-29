const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const questionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    title: String,
    assignment: { type: String, ref: "Assignment" },
    type: String,
    options: [String],
    correctAnswer: String,
    points: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
