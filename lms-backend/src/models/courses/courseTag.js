const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const courseTagSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  name: String,
  description: String,
});

module.exports = mongoose.model("CourseTag", courseTagSchema);
