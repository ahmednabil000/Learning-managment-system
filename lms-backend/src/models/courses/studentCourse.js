const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const studentCourseSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("StudentCourse", studentCourseSchema);
