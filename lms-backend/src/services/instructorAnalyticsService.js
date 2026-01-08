const Course = require("../models/courses/course");
const UserEnroll = require("../models/userEnroll");
const CourseComment = require("../models/courses/courseComment");

module.exports.coursesCount = async (instructorId, startDate, endDate) => {
  const coursesCount = await Course.countDocuments({
    instructor: instructorId,
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  });
  return coursesCount;
};

module.exports.enrolledUsersCount = async (
  instructorId,
  startDate,
  endDate
) => {
  // Find all courses by the instructor
  const courses = await Course.find({ instructor: instructorId }).select("_id");
  const courseIds = courses.map((course) => course._id);

  // Count enrollments for these courses
  const enrolledUsersCount = await UserEnroll.countDocuments({
    course: { $in: courseIds },
    enrollDate: {
      $gte: startDate,
      $lte: endDate,
    },
  });
  return enrolledUsersCount;
};

module.exports.totalRevenue = async (
  instructorId,
  startDate,
  endDate,
  courseId
) => {
  let query = {
    enrollDate: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  if (courseId) {
    // If a specific course is requested, verify it belongs to the instructor
    const course = await Course.findOne({
      _id: courseId,
      instructor: instructorId,
    });
    if (!course) return 0;
    query.course = courseId;
  } else {
    // Otherwise, get all courses for the instructor
    const courses = await Course.find({ instructor: instructorId }).select(
      "_id"
    );
    query.course = { $in: courses.map((c) => c._id) };
  }

  const enrollments = await UserEnroll.find(query).populate("course");

  return enrollments.reduce(
    (total, enrollment) =>
      total + (enrollment.course ? enrollment.course.price : 0),
    0
  );
};

module.exports.getCoursesEnrolledCount = async (
  instructorId,
  startDate,
  endDate
) => {
  // 1. Get all courses for this instructor to ensure we list them all
  const courses = await Course.find({ instructor: instructorId }).select(
    "_id title"
  );
  const courseIds = courses.map((c) => c._id);

  // 2. Aggregate enrollments per course
  const enrollments = await UserEnroll.aggregate([
    {
      $match: {
        course: { $in: courseIds },
        enrollDate: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$course",
        count: { $sum: 1 },
      },
    },
  ]);

  // 3. Map results to include all courses (even with 0 enrollments)
  const result = courses.map((course) => {
    const enrollment = enrollments.find((e) => e._id === course._id);
    return {
      courseId: course._id,
      title: course.title,
      count: enrollment ? enrollment.count : 0,
    };
  });

  return result;
};

module.exports.getTopCourses = async (instructorId, limit) => {
  const limitNum = parseInt(limit) || 5;

  const courses = await Course.find({ instructor: instructorId }).select(
    "_id title"
  );
  const courseIds = courses.map((c) => c._id);

  const topEnrollments = await UserEnroll.aggregate([
    {
      $match: {
        course: { $in: courseIds },
      },
    },
    {
      $group: {
        _id: "$course",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
    {
      $limit: limitNum,
    },
  ]);

  // Map back to get course details
  const result = topEnrollments.map((enrollment) => {
    const course = courses.find((c) => c._id === enrollment._id);
    return {
      courseId: enrollment._id,
      title: course ? course.title : "Unknown Course",
      count: enrollment.count,
    };
  });

  return result;
};

module.exports.getInstructorRate = async (instructorId) => {
  const coursesIds = await Course.find({ instructor: instructorId }).select(
    "_id"
  );
  const courseIds = coursesIds.map((c) => c._id);

  const courses = await CourseComment.find({
    course: { $in: courseIds },
  }).select("_id rate");

  const totalRate = courses.reduce((total, course) => total + course.rate, 0);
  return totalRate / courses.length;
};
