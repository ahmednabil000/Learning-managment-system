const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const commentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    content: String,
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    lecture: {
      type: String,
      ref: "Lecture",
      required: true,
    },
    parentComment: {
      type: String,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
