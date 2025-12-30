const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const courseCommentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    course: {
      type: String,
      ref: "Course",
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CourseComment", courseCommentSchema);
