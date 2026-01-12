const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const LiveSessionSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    courseId: {
      type: String,
      ref: "Course",
      required: true,
    },
    roomName: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["scheduled", "live", "ended"],
      default: "scheduled",
      required: true,
    },
    startsAt: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: false,
    },
    endsAt: {
      type: Date,
      required: false,
    },
    createdBy: {
      type: String,
      ref: "Instructor",
      required: true,
    },
    recordingEnabled: {
      type: Boolean,
      default: false,
    },
    maxParticipants: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LiveSession", LiveSessionSchema);
