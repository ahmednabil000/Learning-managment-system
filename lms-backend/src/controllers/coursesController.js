const courseService = require("../services/courseService");
const paginationValidator = require("../validations/paginationValidator");
const courseValidator = require("../validations/courses/courseValidator");
const logger = require("../config/logger");
exports.getCourseById = async (req, res) => {
  try {
    console.log(req.user.id);
    const course = await courseService.getCourseById(
      req.params.id,
      req.user?.id
    );
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
      await courseService.getAllCourses(page, pageCount, search, req.user?.id);

    const shortCourses = courses.map((course) => ({
      _id: course._id,
      title: course.title,
      description: course.description,
      price: course.price,
      imageUrl: course.imageUrl,
      level: course.level,
      salePrice: course.salePrice,
      discount: course.discount,
      isEnroll: course.isEnroll || false,
      rate: course.rate || 0,
      instructor: course.instructor,
      reviewCount: course.reviewCount || 0,
      studentsCount: course.studentsCount || 0,
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
exports.getInstructorCourses = async (req, res) => {
  try {
    logger.info("Fetching instructor courses");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { courses, totalItems, totalPages } =
      await courseService.getInstructorCourses(
        req.params.instructorId,
        page,
        limit
      );

    logger.info("Instructor courses fetched successfully");
    res.json({
      courses,
      page,
      limit,
      totalItems,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch (error) {
    logger.error("Error fetching instructor courses:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getMyEnrolledCourses = async (req, res) => {
  try {
    logger.info("Fetching enrolled courses");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { courses, totalItems, totalPages } =
      await courseService.getMyEnrolledCourses(
        req.user.id,
        page - 1, // Service expects offset (0-indexed page) or actual offset? Service logic: skip(offset * limit). If user passes 1, offset should be 0.
        limit
      );

    // Service logic reminder: skip(offset * limit).
    // If I pass page=1, I want offset=0. (1-1)=0.
    // If I pass page=2, I want offset=1. (2-1)=1.
    // So passing `page - 1` is correct for the service implementation shown in the user's snippet.

    const enrolledCourses = courses.map((enroll) => ({
      ...enroll.course, // Spread course details
      enrolledAt: enroll.enrolledAt, // Add enrollment date
    }));

    logger.info("Enrolled courses fetched successfully");
    res.json({
      courses: enrolledCourses,
      page,
      limit,
      totalItems,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch (error) {
    logger.error("Error fetching enrolled courses:", error);
    res.status(500).json({ message: error.message });
  }
};
exports.getTopCourses = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const courses = await courseService.getTopCourses(limit);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addLearning = async (req, res) => {
  try {
    const { learningItem } = req.body;
    if (!learningItem)
      return res.status(400).json({ message: "Item required" });
    const result = await courseService.addLearning(
      req.user.id,
      req.params.id,
      learningItem
    );
    if (result.statusCode)
      return res.status(result.statusCode).json({ message: result.message });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeLearning = async (req, res) => {
  try {
    const { index } = req.params;
    const result = await courseService.removeLearning(
      req.user.id,
      req.params.id,
      parseInt(index)
    );
    if (result.statusCode)
      return res.status(result.statusCode).json({ message: result.message });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLearning = async (req, res) => {
  try {
    const { index } = req.params;
    const { learningItem } = req.body;
    if (!learningItem)
      return res.status(400).json({ message: "Item required" });
    const result = await courseService.updateLearning(
      req.user.id,
      req.params.id,
      parseInt(index),
      learningItem
    );
    if (result.statusCode)
      return res.status(result.statusCode).json({ message: result.message });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addRequirement = async (req, res) => {
  try {
    const { requirementItem } = req.body;
    if (!requirementItem)
      return res.status(400).json({ message: "Item required" });
    const result = await courseService.addRequirement(
      req.user.id,
      req.params.id,
      requirementItem
    );
    if (result.statusCode)
      return res.status(result.statusCode).json({ message: result.message });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeRequirement = async (req, res) => {
  try {
    const { index } = req.params;
    const result = await courseService.removeRequirement(
      req.user.id,
      req.params.id,
      parseInt(index)
    );
    if (result.statusCode)
      return res.status(result.statusCode).json({ message: result.message });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRequirement = async (req, res) => {
  try {
    const { index } = req.params;
    const { requirementItem } = req.body;
    if (!requirementItem)
      return res.status(400).json({ message: "Item required" });
    const result = await courseService.updateRequirement(
      req.user.id,
      req.params.id,
      parseInt(index),
      requirementItem
    );
    if (result.statusCode)
      return res.status(result.statusCode).json({ message: result.message });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
