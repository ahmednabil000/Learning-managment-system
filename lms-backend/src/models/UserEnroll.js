const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userEnrollSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  user: {
    type: String,
    ref: "User",
    required: true,
  },
  course: {
    type: String,
    ref: "Course",
    required: true,
  },
  enrollDate: {
    type: Date,
    default: Date.now,
  },
});

const UserEnroll = mongoose.model("UserEnroll", userEnrollSchema);

module.exports = UserEnroll;
