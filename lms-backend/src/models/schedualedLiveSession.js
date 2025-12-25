const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const scheduledLiveSessionSchema = mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  sessionId: {
    type: String,
    ref: "LiveSession",
    required: false,
  },
  status: {
    type: String,
    enum: ["scheduled", "live", "finished"],
    default: "scheduled",
    required: true,
  },
  startsAt: {
    type: Date,
    required: true,
  },
  instructor: {
    type: String,
    ref: "Instructor",
    require: true,
  },
});

module.exports = mongoose.model(
  "ScheduledLiveSession",
  scheduledLiveSessionSchema
);
