const courseService = require("../services/courseService");
const paginationValidator = require("../validations/paginationValidator");
const courseValidator = require("../validations/courseValidator");

exports.getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const { page, pageCount, search } = await paginationValidator.validateAsync(
      req.query
    );

    const { courses, totalItems, totalPages } =
      await courseService.getAllCourses(page, pageCount, search);

    res.json({
      courses,
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
    res.status(500).json({ message: error.message });
  }
};

exports.updateCourseById = async (req, res) => {
  try {
    const { title, description, price, imageUrl } = req.params;

    const validationData = await courseValidator.validateAsync({
      title,
      description,
      price,
      imageUrl,
    });
    const course = await courseService.updateCourseById(
      req.params.id,
      validationData
    );
    res.json(course);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.deleteCourseById = async (req, res) => {
  try {
    const course = await courseService.deleteCourseById(req.params.id);
    res.json(course);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
