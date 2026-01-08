const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const courseSaleSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    course: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CourseSale", courseSaleSchema);
