const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const LectureItem = require("./courses/lectureitem");

const courseBlogSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
});

module.exports = LectureItem.discriminator("CourseBlog", courseBlogSchema);
