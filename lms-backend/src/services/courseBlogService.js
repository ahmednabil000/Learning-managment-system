const CourseBlog = require("../models/courseBlog");
const Course = require("../models/courses/course");
const Lecture = require("../models/courses/lecture");
const UserEnroll = require("../models/UserEnroll");

module.exports.createCourseBlog = async (userId, courseBlog) => {
  const course = await Course.findOne({ _id: courseBlog.course });
  if (!course) {
    return {
      statusCode: 404,
      message: "Course not found",
    };
  }

  if (userId != course.instructor) {
    return {
      statusCode: 401,
      message: "You are not authorized to create a blog for this course",
    };
  }
  const lecture = await Lecture.findById(courseBlog.lecture);
  if (!lecture) {
    return {
      statusCode: 404,
      message: "Lecture not found",
    };
  }
  if (lecture.course != courseBlog.course) {
    return {
      statusCode: 400,
      message: "Lecture does not belong to this course",
    };
  }

  const newCourseBlog = await CourseBlog.create({
    ...courseBlog,
    user: userId,
    isOpen: false,
  });
  return {
    statusCode: 201,
    message: "Course blog created successfully",
    data: newCourseBlog,
  };
};

module.exports.getAllCourseBlogs = async (courseId, page, limit) => {
  const courseBlogs = await CourseBlog.find({ course: courseId })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .select("_id title createdAt thumbnail");

  return courseBlogs;
};

module.exports.getCourseBlogById = async (studentId, id) => {
  const courseBlog = await CourseBlog.findById(id).populate("user");
  const userEnroll = await UserEnroll.findOne({
    user: studentId,
    course: courseBlog.course,
  });
  if (!userEnroll) {
    return {
      statusCode: 401,
      message: "You are not authorized to access this course blog",
    };
  }
  if (!courseBlog) {
    return {
      statusCode: 404,
      message: "Course blog not found",
    };
  }
  return courseBlog;
};

module.exports.updateCourseBlog = async (userId, id, courseBlogData) => {
  const courseBlog = await CourseBlog.findById(id);
  if (!courseBlog) {
    return {
      statusCode: 404,
      message: "Course blog not found",
    };
  }
  if (userId != courseBlog.user._id) {
    return {
      statusCode: 401,
      message: "You are not authorized to update this course blog",
    };
  }
  courseBlog.title = courseBlogData.title || courseBlog.title;
  courseBlog.content = courseBlogData.content || courseBlog.content;
  courseBlog.thumbnail = courseBlogData.thumbnail || courseBlog.thumbnail;
  await courseBlog.save();
  return courseBlog;
};

module.exports.deleteCourseBlog = async (userId, id) => {
  const courseBlog = await CourseBlog.findById(id);
  if (!courseBlog) {
    return {
      statusCode: 404,
      message: "Course blog not found",
    };
  }
  if (userId != courseBlog.user._id) {
    return {
      statusCode: 401,
      message: "You are not authorized to delete this course blog",
    };
  }
  await courseBlog.deleteOne();
  return courseBlog;
};
