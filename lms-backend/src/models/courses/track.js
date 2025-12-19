const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4(),
    },
    title: String,
    description: String,
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    coverImage: String,
    duration: Number,
    isPublished: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Track", trackSchema);
