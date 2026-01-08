const { User, Instructor, Student, Admin, SuperAdmin } = require("./user");
const Course = require("./courses/course");
const Lecture = require("./courses/lecture");
const Lesson = require("./courses/lesson");
const CourseTag = require("./courses/courseTag");
const LiveSession = require("./liveSessions");
const SessionParticipant = require("./sessionParticipant");
const Recording = require("./recording");
const Exam = require("./courses/exam");
const ExamQuestion = require("./courses/examQuestion");
const ExamAttempt = require("./courses/examAttempt");
const ExamQuestionAnswer = require("./courses/examQuestionAnswer");

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
  LiveSession,
  SessionParticipant,
  Recording,
  Exam,
  ExamQuestion,
  ExamAttempt,
  ExamQuestionAnswer,
};
