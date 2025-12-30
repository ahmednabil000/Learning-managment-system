const courseCommentService = require("../services/courseCommentService");
const { courseCommentSchema } = require("../validations/courses/courseComment");
const logger = require("../config/logger");

module.exports.createCourseComment = async (req, res) => {
  try {
    // Validate request body
    const { error } = courseCommentSchema.validate({
      ...req.body,
      user: req.user.id, // validation schema expects user
    });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const comment = await courseCommentService.createCourseComment(
      req.user.id,
      req.body
    );
    res.status(201).json(comment);
  } catch (error) {
    logger.error("Error creating course comment:", error);
    res.status(500).json({ error: "Failed to create course comment" });
  }
};

module.exports.updateCourseComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Partially validate only the fields that are being updated?
    // Usually updates allow partial fields, but schema might be strict.
    // For now, let's assume body contains rate/content updates.

    const result = await courseCommentService.updateCourseComment(
      req.user.id,
      id,
      req.body
    );

    if (result.statusCode) {
      return res.status(result.statusCode).json({ error: result.message });
    }
    res.json(result);
  } catch (error) {
    logger.error("Error updating course comment:", error);
    res.status(500).json({ error: "Failed to update course comment" });
  }
};

module.exports.deleteCourseComment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await courseCommentService.deleteCourseComment(
      req.user.id,
      id
    );

    if (result && result.statusCode) {
      return res.status(result.statusCode).json({ error: result.message });
    }
    res.json({ message: "Comment deleted successfully", result });
  } catch (error) {
    logger.error("Error deleting course comment:", error);
    res.status(500).json({ error: "Failed to delete course comment" });
  }
};

module.exports.getCourseCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await courseCommentService.getCourseCommentById(id);
    if (result.statusCode) {
      return res.status(result.statusCode).json({ error: result.message });
    }
    res.json(result);
  } catch (error) {
    logger.error("Error fetching course comment:", error);
    res.status(500).json({ error: "Failed to fetch course comment" });
  }
};

module.exports.getCourseCommentsByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const comments = await courseCommentService.getCourseCommentsByCourseId(
      page,
      limit,
      courseId
    );
    const total = await courseCommentService.getCourseCommentsCountByCourseId(
      courseId
    );

    res.json({
      data: comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error("Error fetching course comments:", error);
    res.status(500).json({ error: "Failed to fetch course comments" });
  }
};

module.exports.getCourseRate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const rate = await courseCommentService.getCourseRate(courseId);
    res.json({ courseId, averageRate: rate || 0 });
  } catch (error) {
    logger.error("Error fetching course rate:", error);
    res.status(500).json({ error: "Failed to fetch course rate" });
  }
};
