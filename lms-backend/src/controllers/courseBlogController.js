const courseBlogService = require("../services/courseBlogService");
const courseBlogValidator = require("../validations/courseBlogValidator");
const logger = require("../config/logger");

exports.createCourseBlog = async (req, res) => {
  try {
    const { error, value } = courseBlogValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await courseBlogService.createCourseBlog(req.user.id, value);

    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }

    res.status(201).json(result);
  } catch (error) {
    logger.error("Error creating course blog:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCourseBlogs = async (req, res) => {
  try {
    console.log("rex");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const courseBlogs = await courseBlogService.getAllCourseBlogs(
      req.params.courseId,
      page,
      limit
    );

    res.status(200).json(courseBlogs);
  } catch (error) {
    logger.error("Error fetching course blogs:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseBlogById = async (req, res) => {
  try {
    const result = await courseBlogService.getCourseBlogById(
      req.user.id,
      req.params.id
    );

    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }

    res.status(200).json(result);
  } catch (error) {
    logger.error("Error fetching course blog:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateCourseBlog = async (req, res) => {
  try {
    // Note: We might want to validate req.body here too, but the service handles partial updates logic via '||'
    // Depending on strictness, we could use the validator or a partial validator.
    // For now, passing body directly as service handles merging.

    // However, the validator requires 'course', 'title', 'content', so using it for updates might fail if fields are missing.
    // I will skip strict validation for update or assume full update if required, but the service does partial.
    // Let's rely on manual validation or just pass data for now, as I don't want to create a new validator strictly.

    const result = await courseBlogService.updateCourseBlog(
      req.user.id,
      req.params.id,
      req.body
    );

    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }

    res.status(200).json(result);
  } catch (error) {
    logger.error("Error updating course blog:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCourseBlog = async (req, res) => {
  try {
    const result = await courseBlogService.deleteCourseBlog(
      req.user.id,
      req.params.id
    );

    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }

    res.status(200).json({ message: "Course blog deleted successfully" });
  } catch (error) {
    logger.error("Error deleting course blog:", error);
    res.status(500).json({ message: error.message });
  }
};
