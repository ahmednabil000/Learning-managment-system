const { Course, Lecture, Lesson, CourseTag } = require("../models");
const courseValidation = require("../validations/courses/courseValidator");

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
    .populate("tag");

  const totalItems = await Course.countDocuments({
    title: { $regex: search, $options: "i" },
  });
  const totalPages = Math.ceil(totalItems / pageCount);

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
