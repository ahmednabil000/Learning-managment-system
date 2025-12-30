const CourseComment = require("../models/courses/courseComment");
const UserEnrollment = require("../models/UserEnroll");

module.exports.createCourseComment = async (userId, courseCommentData) => {
  const userEnrollment = await UserEnrollment.findOne({
    user: userId,
    course: courseCommentData.course,
  });
  if (!userEnrollment)
    return {
      statusCode: 403,
      message: "You are not authorized to comment on this course",
    };
  const courseComment = new CourseComment({
    ...courseCommentData,
    user: userId,
  });
  return await courseComment.save();
};

module.exports.updateCourseComment = async (
  userId,
  courseCommentId,
  courseCommentData
) => {
  const courseComment = await CourseComment.findById(courseCommentId);
  if (!courseComment)
    return { statusCode: 404, message: "Course comment not found" };
  if (courseComment.user.toString() !== userId)
    return {
      statusCode: 403,
      message: "You are not authorized to update this course comment",
    };
  return await CourseComment.findByIdAndUpdate(
    courseCommentId,
    courseCommentData,
    { new: true }
  );
};

module.exports.deleteCourseComment = async (userId, courseCommentId) => {
  const courseComment = await CourseComment.findById(courseCommentId);
  if (!courseComment)
    return { statusCode: 404, message: "Course comment not found" };
  if (courseComment.user.toString() !== userId)
    return {
      statusCode: 403,
      message: "You are not authorized to delete this course comment",
    };
  return await CourseComment.findByIdAndDelete(courseCommentId);
};

module.exports.getCourseCommentById = async (courseCommentId) => {
  const courseComment = await CourseComment.findById(courseCommentId);
  if (!courseComment)
    return { statusCode: 404, message: "Course comment not found" };
  return courseComment;
};

module.exports.getCourseCommentsByCourseId = async (page, limit, courseId) => {
  const skip = (page - 1) * limit;
  const courseComments = await CourseComment.find({ course: courseId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  return courseComments;
};

module.exports.getCourseCommentsCountByCourseId = async (courseId) => {
  const courseCommentsCount = await CourseComment.countDocuments({
    course: courseId,
  });
  return courseCommentsCount;
};

module.exports.getCourseRate = async (courseId) => {
  const courseComments = await CourseComment.find({ course: courseId });
  const totalRate = courseComments.reduce(
    (total, comment) => total + comment.rate,
    0
  );
  return totalRate / courseComments.length;
};
