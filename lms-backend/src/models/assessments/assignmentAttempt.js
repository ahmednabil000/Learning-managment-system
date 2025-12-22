const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const assignmentAttemptSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },

    totalPoints: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssignmentAttempt", assignmentAttemptSchema);
