const mongoose = require("mongoose");

const courseSectionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4(),
    },
    title: String,
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseVideo",
      },
    ],
    order: Number,
    duration: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CourseSection", courseSectionSchema);
