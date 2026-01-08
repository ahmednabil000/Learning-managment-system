const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const trackSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      ref: "User",
    },
    courses: [
      {
        type: String,
        ref: "Course",
      },
    ],
    discount: Number,
    thumbnail: String,
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

trackSchema.index({ title: 1, description: 1 });

module.exports = mongoose.model("Track", trackSchema);
