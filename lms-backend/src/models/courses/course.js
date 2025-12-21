const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const courseSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    tag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseTag",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
