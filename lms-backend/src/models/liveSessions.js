const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const LiveSessionSchema = mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  roomId: { type: String, unique: true, sparse: true },
  instructor: {
    type: String,
    ref: "Instructor",
    required: true,
  },
  roomName: { type: String, unique: true, sparse: true },
  title: String,
  description: String,
  recordingId: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("LiveSession", LiveSessionSchema);
