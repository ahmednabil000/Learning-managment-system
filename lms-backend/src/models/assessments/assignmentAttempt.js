const mongoose = require("mongoose");

const assignmentAttemptSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },

    totalPoints: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssignmentAttempt", assignmentAttemptSchema);
