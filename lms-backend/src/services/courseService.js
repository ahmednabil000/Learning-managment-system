const { Course, Lecture, Lesson, CourseTag } = require("../models");
const CourseSale = require("../models/courses/courseSale");

exports.getCourseById = async (id) => {
  const course = await Course.findOne({ _id: id })
    .populate("tag")
    .populate("instructor")
    .lean();

  if (!course) {
    return null;
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
  console.log(courseSale);
  if (courseSale) {
    course.salePrice = courseSale.salePrice;
    course.discount = courseSale.discount;
  }
  const totalDuration = lessons.reduce((acc, value) => acc + value.duration, 0);

  course.lectures = lecturesWithLessons;
  course.totalDuration = totalDuration;

  return course;
};

exports.getAllCourses = async (page, pageCount, search) => {
  const courses = await Course.find({
    title: { $regex: search, $options: "i" },
  })
    .skip((page - 1) * pageCount)
    .limit(pageCount)
    .populate("instructor")
    .populate("tag")
    .lean();

  const totalItems = await Course.countDocuments({
    title: { $regex: search, $options: "i" },
  });
  const totalPages = Math.ceil(totalItems / pageCount);
  const courseSales = await CourseSale.find({
    course: { $in: courses.map((course) => course._id) },
    status: "active",
  });
  console.log(courseSales);
  courses.forEach((course) => {
    const courseSale = courseSales.find((sale) => sale.course === course._id);
    if (courseSale) {
      course.salePrice = courseSale.salePrice;
      course.discount = courseSale.discount;
    }
  });

  console.log(courses);
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

  await course.remove();
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

  const salePrice = course.price - (course.price * saleData.discount) / 100;

  const courseSale = await CourseSale.create({
    course: course._id,
    user: userId,
    salePrice,
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
