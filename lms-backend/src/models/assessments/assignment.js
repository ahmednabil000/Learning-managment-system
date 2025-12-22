const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const assignmentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    title: String,
    lecture: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture" },
    totalPoints: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
