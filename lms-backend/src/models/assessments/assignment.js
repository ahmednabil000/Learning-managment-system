const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const assignmentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    title: String,
    lecture: { type: String, ref: "Lecture" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
