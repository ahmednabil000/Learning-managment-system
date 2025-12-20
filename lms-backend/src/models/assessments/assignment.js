const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: String,
    lecture: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture" },
    totalPoints: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
