const mongoose = require("mongoose");

const courseVideoSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4(),
    },
    title: String,
    courseSection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseSection",
      required: true,
    },
    url: String,
    order: Number,
    duration: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CourseVideo", courseVideoSchema);
