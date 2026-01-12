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
      type: String,
      ref: "Instructor",
      required: true,
    },
    tag: {
      type: String,
      ref: "CourseTag",
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "beginner",
      required: true,
    },
    learning: [String],
    requirements: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
