const Assignment = require("../../models/assessments/assignment");
const Lecture = require("../../models/courses/lecture");
const Question = require("../../models/assessments/question");
const UserEnroll = require("../../models/UserEnroll");
const Course = require("../../models/courses/course");

module.exports.createAssignment = async (assignmentData) => {
  return await Assignment.create(assignmentData);
};

module.exports.getAssignmentById = async (userId, id) => {
  const assignment = await Assignment.findOne({ _id: id }).lean();
  const lecture = await Lecture.findOne({ _id: assignment.lecture });
  const course = await Course.findOne({ _id: lecture.course });
  const userEnroll = await UserEnroll.findOne({
    course: course._id,
    user: userId,
  });
  if (!userEnroll) {
    return {
      statusCode: 403,
      message: "You are not authorized to access this assignment",
    };
  }
  if (!assignment) return { statusCode: 404, message: "Assignment not found" };
  const questions = await Question.find({ assignment: id });
  assignment.questions = questions;
  return assignment;
};

module.exports.getAssignments = async (page, pageCount, search) => {
  return await Assignment.find({ title: { $regex: search } })
    .limit(pageCount)
    .skip((page - 1) * pageCount)
    .sort({ createdAt: -1 });
};

module.exports.updateAssignmentById = async (id, updateData) => {
  return await Assignment.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
  });
};

module.exports.deleteAssignmentById = async (id) => {
  return await Assignment.findOneAndDelete({ _id: id });
};

module.exports.getAssignmentsByCourseId = async (
  courseId,
  page = 1,
  pageCount = 10
) => {
  const lecturesIds = await Lecture.find({ course: courseId }).select("_id");
  const filter = { lecture: { $in: lecturesIds } };
  const totalItems = await Assignment.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / pageCount);
  const assignments = await Assignment.find(filter);

  return {
    assignments,
    totalItems,
    totalPages,
    page,
    pageCount,
  };
};

module.exports.getAssignmentsByLectureId = async (
  lectureId,
  page = 1,
  pageCount = 10
) => {
  const totalItems = await Assignment.countDocuments({ lecture: lectureId });
  const totalPages = Math.ceil(totalItems / pageCount);
  const assignments = await Assignment.find({ lecture: lectureId })
    .skip((page - 1) * pageCount)
    .limit(pageCount)
    .sort({ createdAt: -1 });
  return {
    assignments,
    totalItems,
    totalPages,
    page,
    pageCount,
  };
};
