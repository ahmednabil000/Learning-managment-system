const { User, Instructor, Student, Admin, SuperAdmin } = require("./user");
const Course = require("./courses/course");
const Lecture = require("./courses/Lecture");
const Lesson = require("./courses/lesson");
const CourseTag = require("./courses/courseTag");

module.exports = {
  User,
  Instructor,
  Student,
  Admin,
  SuperAdmin,
  Course,
  Lecture,
  Lesson,
  CourseTag,
};
