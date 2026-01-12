const mongoose = require("mongoose");
// Fix require path casing for linux
const { v4: uuidv4 } = require("uuid");

const LectureItem = require("./lectureItem");

const lessonSchema = new mongoose.Schema({
  publicId: String,
  duration: Number,
});

module.exports = LectureItem.discriminator("Lesson", lessonSchema);
