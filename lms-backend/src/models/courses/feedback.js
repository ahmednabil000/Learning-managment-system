const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4(),
    },
    body: String,
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
