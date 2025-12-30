const courseService = require("../services/courseService");
const paginationValidator = require("../validations/paginationValidator");
const courseValidator = require("../validations/courses/courseValidator");
const logger = require("../config/logger");

exports.getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    logger.info("Fetching courses");
    const { error, value } = paginationValidator.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { page, pageCount, search } = value;

    const { courses, totalItems, totalPages } =
      await courseService.getAllCourses(page, pageCount, search);

    const shortCourses = courses.map((course) => ({
      _id: course._id,
      title: course.title,
      description: course.description,
      price: course.price,
      imageUrl: course.imageUrl,
      level: course.level,
    }));
    logger.info("Courses fetched successfully");
    res.json({
      shortCourses,
      page,
      pageCount,
      totalItems,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch (error) {
    logger.error("Error fetching courses:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    console.log("rec");
    const { error, value } = courseValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { title, description, price, imageUrl, tag, level } = value;

    const course = await courseService.createCourse({
      title,
      description,
      price,
      imageUrl,
      instructor: req.user.id,
      tag,
      level,
    });
    res.status(201).json(course);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.updateCourseById = async (req, res) => {
  try {
    const { error, value } = courseValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { title, description, price, imageUrl, tag, level } = value;

    const course = await courseService.updateCourse({
      id: req.params.id,
      title,
      description,
      price,
      tag,
      imageUrl,
      instructor: req.user.id,
      level,
    });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCourseById = async (req, res) => {
  try {
    const course = await courseService.deleteCourse(req.params.id);
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addCourseDiscount = async (req, res) => {
  try {
    logger.info("Adding course discount");
    const saleData = req.body;
    const result = await courseService.addCourseDiscount(
      req.user.id,
      req.params.courseId,
      saleData
    );
    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    logger.info("Course discount added successfully");
    res.json(result);
  } catch (error) {
    logger.error("Error adding course discount:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.removeCourseDiscount = async (req, res) => {
  try {
    logger.info("Removing course discount");
    const result = await courseService.removeCourseDiscount(
      req.user.id,
      req.params.courseId
    );
    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    logger.info("Course discount removed successfully");
    res.json(result);
  } catch (error) {
    logger.error("Error removing course discount:", error);
    res.status(500).json({ message: error.message });
  }
};
