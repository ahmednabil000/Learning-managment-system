const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const LectureItem = require("./lectureitem");

const lessonSchema = new mongoose.Schema({
  publicId: String,
  duration: Number,
});

module.exports = LectureItem.discriminator("Lesson", lessonSchema);
