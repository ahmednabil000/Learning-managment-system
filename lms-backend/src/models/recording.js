const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const RecordingSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    sessionId: {
      type: String,
      ref: "LiveSession",
      required: true,
    },
    recordingId: {
      type: String,
      required: true,
      comment: "Daily.co recording ID",
    },
    s3Key: {
      type: String,
      required: false,
      comment: "S3 storage key for the recording",
    },
    duration: {
      type: Number,
      required: false,
      comment: "Duration in seconds",
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
RecordingSchema.index({ sessionId: 1 });
RecordingSchema.index({ recordingId: 1 });

module.exports = mongoose.model("Recording", RecordingSchema);
