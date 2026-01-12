const assignmentService = require("../../services/assesments/assignmentService");
const assignmentValidator = require("../../validations/assessments/assignmentValidator");
const paginationValidator = require("../../validations/paginationValidator");
const logger = require("../../config/logger");
module.exports.createAssignment = async (req, res) => {
  try {
    logger.info(`Start creating assignment`);
    const { error, value } = assignmentValidator.validate(req.body);
    if (error) {
      logger.error(`Error creating assignment`, error);
      return res.status(400).json({ message: error.details[0].message });
    }
    const assignment = await assignmentService.createAssignment(value);
    logger.info(`End creating assignment`);
    return res.status(201).json(assignment);
  } catch (error) {
    logger.error(`Error creating assignment`, error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getAssignmentById = async (req, res) => {
  try {
    logger.info(`Start fetching assignment ${req.params.id}`);
    const result = await assignmentService.getAssignmentById(
      req.user.id,
      req.params.id
    );
    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    logger.info(`End fetching assignment ${req.params.id}`);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Error fetching assignment ${req.params.id}`, error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getAssignments = async (req, res) => {
  try {
    const { error, value } = paginationValidator.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { page, pageCount, search } = value;

    const assignments = await assignmentService.getAssignments(
      page,
      pageCount,
      search
    );
    const totalItems = assignments.length;
    const totalPages = Math.ceil(totalItems / pageCount);

    res.json({
      assignments,
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
    return res.status(500).json({ message: error.message });
  }
};

module.exports.updateAssignment = async (req, res) => {
  try {
    const { error, value } = assignmentValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const assignment = await assignmentService.updateAssignmentById(
      req.params.id,
      value
    );
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    return res.status(200).json(assignment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await assignmentService.deleteAssignmentById(
      req.params.id
    );
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    return res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getAssignmentsByCourseId = async (req, res) => {
  try {
    logger.info(`Start fetching course ${req.query.courseId} assignments`);
    const { courseId, page = 1, pageCount = 10 } = req.query;
    if (!courseId) {
      return res.status(400).json({ message: "courseId is required" });
    }
    const result = await assignmentService.getAssignmentsByCourseId(
      courseId,
      parseInt(page),
      parseInt(pageCount)
    );

    logger.info(`End fetching course ${req.query.courseId} assignments`);
    res.status(200).json(result);
  } catch (error) {
    logger.error(
      `Error fetching course ${req.query.courseId} assignments`,
      error
    );
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAssignmentsByLectureId = async (req, res) => {
  try {
    logger.info(`Start fetching lecture ${req.params.lectureId} assignments`);
    const { lectureId, page = 1, pageCount = 10 } = req.params;
    if (!lectureId) {
      return res.status(400).json({ message: "lectureId is required" });
    }
    const result = await assignmentService.getAssignmentsByLectureId(
      lectureId,
      parseInt(page),
      parseInt(pageCount)
    );
    logger.info(`End fetching lecture ${req.params.lectureId} assignments`);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
