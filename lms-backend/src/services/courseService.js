const { Course } = require("../models");
const courseValidation = require("../validations/courseValidator");

exports.getCourseById = async (id) => {
  const course = await Course.findById(id);
  return course;
};

exports.getAllCourses = async (page, pageCount, search) => {
  const courses = await Course.find({
    title: { $regex: search, $options: "i" },
  })
    .skip((page - 1) * pageCount)
    .limit(pageCount);

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

exports.createCourse = async ({ title, description, price, imageUrl }) => {
  const course = await Course.create({ title, description, price, imageUrl });
  return course;
};

exports.updateCourse = async ({ id, title, description, price, imageUrl }) => {
  const course = await Course.findById(id);

  if (!course) {
    throw error("Course not found");
  }

  course.title = title;
  course.description = description;
  course.price = price;
  course.imageUrl = imageUrl;

  await course.save();

  return course;
};

exports.deleteCourse = async (id) => {
  const course = await Course.findById(id);

  if (!course) {
    throw error("Course not found");
  }

  await course.remove();
  return course;
};
