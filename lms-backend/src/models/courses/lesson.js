const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const lessonSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    title: String,
    lecture: {
      type: String,
      ref: "Lecture",
      required: true,
    },
    course: {
      type: String,
      ref: "Course",
      required: true,
    },
    videoUrl: String,
    order: Number,
    duration: Number,
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lesson", lessonSchema);
