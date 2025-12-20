const assignmentService = require("../../services/assesments/assignmentService");
const assignmentValidator = require("../../validations/assessments/assignmentValidator");
const paginationValidator = require("../../validations/paginationValidator");

module.exports.createAssignment = async (req, res) => {
  try {
    const { error, value } = assignmentValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const assignment = await assignmentService.createAssignment(value);
    return res.status(201).json(assignment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await assignmentService.getAssignmentById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    return res.status(200).json(assignment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getAssignments = async (req, res) => {
  try {
    const { page, pageCount, search } = await paginationValidator.validateAsync(
      req.query
    );

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
