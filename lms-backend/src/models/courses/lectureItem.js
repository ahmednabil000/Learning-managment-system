const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const lectureItemSchema = new mongoose.Schema(
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
    lecture: {
      type: String,
      ref: "Lecture",
      required: true,
    },
    order: Number,
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, discriminatorKey: "kind" }
);

module.exports = mongoose.model("LectureItem", lectureItemSchema);
