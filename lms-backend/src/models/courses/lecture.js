const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const lectureSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    title: String,
    course: {
      type: String,
      ref: "Course",
      required: true,
    },
    lessons: [
      {
        type: String,
        ref: "Lesson",
      },
    ],
    order: Number,
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Lecture || mongoose.model("Lecture", lectureSchema);
