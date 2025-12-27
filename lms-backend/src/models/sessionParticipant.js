const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const SessionParticipantSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: String,
      ref: "LiveSession",
      required: true,
    },
    role: {
      type: String,
      enum: ["instructor", "student"],
      required: true,
    },
    joinedAt: {
      type: Date,
      required: false,
    },
    leftAt: {
      type: Date,
      required: false,
    },
    wasKicked: {
      type: Boolean,
      default: false,
    },
    micAllowed: {
      type: Boolean,
      default: true,
    },
    cameraAllowed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
SessionParticipantSchema.index({ sessionId: 1, userId: 1 });
SessionParticipantSchema.index({ sessionId: 1, role: 1 });

module.exports = mongoose.model("SessionParticipant", SessionParticipantSchema);
