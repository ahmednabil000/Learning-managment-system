const { Course, Lecture, Lesson, CourseTag } = require("../models");
const CourseSale = require("../models/courses/courseSale");
const UserEnroll = require("../models/userEnroll");
const CourseComment = require("../models/courses/courseComment");

exports.getCourseById = async (id, userId = null) => {
  const course = await Course.findOne({ _id: id })
    .populate("tag")
    .populate({
      path: "instructor",
      select: "-email -googleId -password -enrolledCourses",
    })
    .lean();

  if (!course) {
    return null;
  }
  course.isEnroll = false;
  if (userId) {
    const isEnroll = await UserEnroll.findOne({
      user: userId,
      course: course._id,
    });
    if (isEnroll) {
      course.isEnroll = true;
    }
  }
  const lectures = await Lecture.find({ course: course._id })
    .sort({ order: 1 })
    .lean();
  const lectureIds = lectures.map((lecture) => lecture._id);

  const lessons = await Lesson.find({ lecture: { $in: lectureIds } })
    .sort({ order: 1 })
    .lean();

  const lecturesWithLessons = lectures.map((lecture) => {
    return {
      ...lecture,
      lessons: lessons.filter(
        (lesson) => lesson.lecture.toString() === lecture._id.toString()
      ),
    };
  });
  const courseSale = await CourseSale.findOne({
    course: course._id,
    status: "active",
  }).lean();
  if (courseSale) {
    course.salePrice =
      course.price - (course.price * courseSale.discount) / 100;
    course.discount = courseSale.discount;
  }
  const totalDuration = lessons.reduce((acc, value) => acc + value.duration, 0);

  course.lectures = lecturesWithLessons;
  course.totalDuration = totalDuration;

  const ratings = await CourseComment.aggregate([
    { $match: { course: course._id } },
    {
      $group: {
        _id: "$course",
        avgRate: { $avg: "$rate" },
        count: { $sum: 1 },
      },
    },
  ]);

  course.rate =
    ratings.length > 0 ? parseFloat(ratings[0].avgRate.toFixed(1)) : 0;
  course.reviewCount = ratings.length > 0 ? ratings[0].count : 0;

  course.enrollmentCount = await UserEnroll.countDocuments({
    course: course._id,
  });
  console.log(course);
  return course;
};

exports.getAllCourses = async (page, pageCount, search, userId = null) => {
  const courses = await Course.find({
    title: { $regex: search, $options: "i" },
  })
    .skip((page - 1) * pageCount)
    .limit(pageCount)
    .populate("instructor")
    .populate("tag")
    .lean();

  // Initialize isEnroll to false for all courses
  courses.forEach((course) => {
    course.isEnroll = false;
  });

  // Only check enrollment if userId is provided
  if (userId) {
    const coursesIds = courses.map((course) => course._id);
    const userEnrolls = await UserEnroll.find({
      user: userId,
      course: { $in: coursesIds },
    }).lean();

    userEnrolls.forEach((enroll) => {
      const course = courses.find((c) => c._id === enroll.course);
      if (course) {
        course.isEnroll = true;
      }
    });
  }

  const totalItems = await Course.countDocuments({
    title: { $regex: search, $options: "i" },
  });
  const totalPages = Math.ceil(totalItems / pageCount);
  const courseSales = await CourseSale.find({
    course: { $in: courses.map((course) => course._id) },
    status: "active",
  });

  courses.forEach((course) => {
    const courseSale = courseSales.find((sale) => sale.course === course._id);
    if (courseSale) {
      course.salePrice =
        course.price - (course.price * courseSale.discount) / 100;
      course.discount = courseSale.discount;
    }
  });

  // Calculate ratings for all courses
  const courseIds = courses.map((c) => c._id);
  const ratings = await CourseComment.aggregate([
    { $match: { course: { $in: courseIds } } },
    {
      $group: {
        _id: "$course",
        avgRate: { $avg: "$rate" },
        count: { $sum: 1 },
      },
    },
  ]);

  const enrollmentCounts = await UserEnroll.aggregate([
    { $match: { course: { $in: courseIds } } },
    {
      $group: {
        _id: "$course",
        count: { $sum: 1 },
      },
    },
  ]);

  courses.forEach((course) => {
    const rating = ratings.find((r) => r._id === course._id);
    course.rate = rating ? parseFloat(rating.avgRate.toFixed(1)) : 0;
    course.reviewCount = rating ? rating.count : 0;

    const enrollment = enrollmentCounts.find((e) => e._id === course._id);
    course.studentsCount = enrollment ? enrollment.count : 0;
  });

  return {
    courses,
    totalItems,
    totalPages,
  };
};

exports.createCourse = async ({
  title,
  description,
  price,
  imageUrl,
  instructor,
  tag,
  level,
}) => {
  // Find the tag by id to get its ObjectId
  const courseTag = await CourseTag.findOne({ _id: tag });
  if (!courseTag) {
    throw new Error("Tag not found");
  }

  const course = await Course.create({
    title,
    description,
    price,
    imageUrl,
    instructor,
    tag: courseTag._id,
    level,
  });
  return course;
};

exports.updateCourse = async ({
  id,
  title,
  description,
  price,
  imageUrl,
  tag,
  instructor,
  level,
}) => {
  const course = await Course.findOne({ _id: id });
  if (!course) {
    throw new Error("Course not found");
  }

  // Find the tag by id to get its ObjectId
  const courseTag = await CourseTag.findOne({ _id: tag });
  if (!courseTag) {
    throw new Error("Tag not found");
  }

  course.title = title;
  course.description = description;
  course.price = price;
  course.imageUrl = imageUrl;
  course.instructor = instructor;
  course.tag = courseTag._id;
  course.level = level;

  await course.save();

  return course;
};

exports.deleteCourse = async (id) => {
  const course = await Course.findOne({ _id: id });

  if (!course) {
    throw new Error("Course not found");
  }

  await course.deleteOne();
  return course;
};

module.exports.addCourseDiscount = async (userId, courseId, saleData) => {
  const course = await Course.findOne({ _id: courseId });
  if (!course) {
    return { statusCode: 404, message: "Course not found" };
  }

  if (course.instructor.toString() !== userId) {
    return {
      statusCode: 403,
      message: "You are not authorized to add discount to this course",
    };
  }
  const startDate = new Date(saleData.startDate);
  const endDate = new Date(saleData.endDate);
  const now = new Date();

  const status = startDate <= now && endDate >= now ? "active" : "inactive";

  const courseSale = await CourseSale.create({
    course: course._id,
    user: userId,
    discount: saleData.discount,
    startDate,
    endDate,
    status,
  });
  return { statusCode: 200, message: "Course discount added successfully" };
};

module.exports.removeCourseDiscount = async (userId, courseId) => {
  const course = await Course.findOne({ _id: courseId });
  if (!course) {
    return { statusCode: 404, message: "Course not found" };
  }
  const courseSale = await CourseSale.findOneAndDelete({
    course: course._id,
    user: userId,
  });
  return { statusCode: 200, message: "Course discount removed successfully" };
};

module.exports.getInstructorCourses = async (userId, page, limit) => {
  console.log("rec");
  const courses = await Course.find({ instructor: userId })
    .populate("tag")
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  const totalItems = await Course.countDocuments({ instructor: userId });
  const totalPages = Math.ceil(totalItems / limit);
  return { courses, totalItems, totalPages };
};

module.exports.getMyEnrolledCourses = async (userId, offset, limit) => {
  const userEnrolls = await UserEnroll.find({ user: userId })
    .populate("course")
    .skip(offset * limit)
    .limit(limit)
    .lean();

  const totalItems = await UserEnroll.countDocuments({ user: userId });
  const totalPages = Math.ceil(totalItems / limit);

  const courseIds = userEnrolls.map((enroll) => enroll.course._id);

  // Aggregate ratings
  const ratings = await CourseComment.aggregate([
    { $match: { course: { $in: courseIds } } },
    {
      $group: {
        _id: "$course",
        avgRate: { $avg: "$rate" },
        count: { $sum: 1 },
      },
    },
  ]);

  // Aggregate student counts
  const enrollmentCounts = await UserEnroll.aggregate([
    { $match: { course: { $in: courseIds } } },
    {
      $group: {
        _id: "$course",
        count: { $sum: 1 },
      },
    },
  ]);

  userEnrolls.forEach((enroll) => {
    if (enroll.course) {
      const rating = ratings.find(
        (r) => r._id.toString() === enroll.course._id.toString()
      );
      enroll.course.rate = rating ? parseFloat(rating.avgRate.toFixed(1)) : 0;
      enroll.course.reviewCount = rating ? rating.count : 0;

      const enrollment = enrollmentCounts.find(
        (e) => e._id.toString() === enroll.course._id.toString()
      );
      enroll.course.studentsCount = enrollment ? enrollment.count : 0;
    }
  });

  return { courses: userEnrolls, totalItems, totalPages };
};

module.exports.addLearning = async (userId, courseId, learningItem) => {
  const course = await Course.findById(courseId);
  if (!course) return { statusCode: 404, message: "Course not found" };
  if (course.instructor.toString() !== userId) {
    return { statusCode: 403, message: "Unauthorized" };
  }
  course.learning.push(learningItem);
  await course.save();
  return course;
};

module.exports.removeLearning = async (userId, courseId, learningIndex) => {
  const course = await Course.findById(courseId);
  if (!course) return { statusCode: 404, message: "Course not found" };
  if (course.instructor.toString() !== userId) {
    return { statusCode: 403, message: "Unauthorized" };
  }
  if (learningIndex < 0 || learningIndex >= course.learning.length) {
    return { statusCode: 400, message: "Invalid index" };
  }
  course.learning.splice(learningIndex, 1);
  await course.save();
  return course;
};

module.exports.updateLearning = async (
  userId,
  courseId,
  learningIndex,
  newItem
) => {
  const course = await Course.findById(courseId);
  if (!course) return { statusCode: 404, message: "Course not found" };
  if (course.instructor.toString() !== userId) {
    return { statusCode: 403, message: "Unauthorized" };
  }
  if (learningIndex < 0 || learningIndex >= course.learning.length) {
    return { statusCode: 400, message: "Invalid index" };
  }
  course.learning[learningIndex] = newItem;
  await course.save();
  return course;
};

module.exports.addRequirement = async (userId, courseId, requirementItem) => {
  const course = await Course.findById(courseId);
  if (!course) return { statusCode: 404, message: "Course not found" };
  if (course.instructor.toString() !== userId) {
    return { statusCode: 403, message: "Unauthorized" };
  }
  course.requirements.push(requirementItem);
  await course.save();
  return course;
};

module.exports.removeRequirement = async (
  userId,
  courseId,
  requirementIndex
) => {
  const course = await Course.findById(courseId);
  if (!course) return { statusCode: 404, message: "Course not found" };
  if (course.instructor.toString() !== userId) {
    return { statusCode: 403, message: "Unauthorized" };
  }
  if (requirementIndex < 0 || requirementIndex >= course.requirements.length) {
    return { statusCode: 400, message: "Invalid index" };
  }
  course.requirements.splice(requirementIndex, 1);
  await course.save();
  return course;
};

module.exports.updateRequirement = async (
  userId,
  courseId,
  requirementIndex,
  newItem
) => {
  const course = await Course.findById(courseId);
  if (!course) return { statusCode: 404, message: "Course not found" };
  if (course.instructor.toString() !== userId) {
    return { statusCode: 403, message: "Unauthorized" };
  }
  if (requirementIndex < 0 || requirementIndex >= course.requirements.length) {
    return { statusCode: 400, message: "Invalid index" };
  }
  course.requirements[requirementIndex] = newItem;
  await course.save();
  return course;
};

module.exports.getTopCourses = async (count) => {
  // 1. Get top courses by enrollment count
  const distinctCourses = await UserEnroll.aggregate([
    {
      $group: {
        _id: "$course",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: count },
  ]);

  if (distinctCourses.length === 0) {
    return [];
  }

  const courseIds = distinctCourses.map((dc) => dc._id);

  // 2. Fetch course details
  const courses = await Course.find({ _id: { $in: courseIds } })
    .populate({
      path: "instructor",
      select: "-email -googleId -password -enrolledCourses",
    })
    .populate("tag")
    .lean();

  // 3. Aggregate ratings for these courses
  const ratings = await CourseComment.aggregate([
    { $match: { course: { $in: courseIds } } },
    {
      $group: {
        _id: "$course",
        avgRate: { $avg: "$rate" },
        count: { $sum: 1 },
      },
    },
  ]);

  // 4. Merge data and preserve order from aggregation
  const orderedCourses = distinctCourses
    .map((dc) => {
      const course = courses.find(
        (c) => c._id.toString() === dc._id.toString()
      );
      if (!course) return null;

      const rating = ratings.find(
        (r) => r._id.toString() === course._id.toString()
      );
      course.rate = rating ? parseFloat(rating.avgRate.toFixed(1)) : 0;
      course.reviewCount = rating ? rating.count : 0;
      course.studentsCount = dc.count; // Use the count from aggregation

      return course;
    })
    .filter((c) => c !== null); // Remove any nulls if course not found

  return orderedCourses;
};
