const assignmentAttemptService = require("../../services/assesments/assignmentAttemptService");
const assignmentAttemptValidator = require("../../validations/assessments/assignmentAttemptValidator");

module.exports.createAssignmentAttempt = async (req, res) => {
  try {
    const { error, value } = assignmentAttemptValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const assignmentAttempt =
      await assignmentAttemptService.createAssignmentAttempt(value);
    return res.status(201).json(assignmentAttempt);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getAssignmentAttemptById = async (req, res) => {
  try {
    const assignmentAttempt =
      await assignmentAttemptService.getAssignmentAttemptById(req.params.id);
    if (!assignmentAttempt) {
      return res.status(404).json({ message: "Assignment attempt not found" });
    }
    return res.status(200).json(assignmentAttempt);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getAssignmentAttempts = async (req, res) => {
  try {
    const { page = 1, pageCount = 10 } = req.query;
    const userId = req.user?.id; // Assuming user is attached to request by auth middleware

    const assignmentAttempts =
      await assignmentAttemptService.getAssignmentAttempts(
        req.params.assignmentId,
        parseInt(page),
        parseInt(pageCount),
        userId
      );

    return res.status(200).json(assignmentAttempts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getAssignmentAttemptsCount = async (req, res) => {
  try {
    const userId = req.user?.id; // Assuming user is attached to request by auth middleware

    const count = await assignmentAttemptService.getAssignmentAttemptsCount(
      req.params.assignmentId,
      userId
    );

    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.updateAssignmentAttempt = async (req, res) => {
  try {
    const { error, value } = assignmentAttemptValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const assignmentAttempt =
      await assignmentAttemptService.updateAssignmentAttemptById(
        req.params.id,
        value
      );
    if (!assignmentAttempt) {
      return res.status(404).json({ message: "Assignment attempt not found" });
    }
    return res.status(200).json(assignmentAttempt);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.deleteAssignmentAttempt = async (req, res) => {
  try {
    const assignmentAttempt =
      await assignmentAttemptService.deleteAssignmentAttemptById(req.params.id);
    if (!assignmentAttempt) {
      return res.status(404).json({ message: "Assignment attempt not found" });
    }
    return res
      .status(200)
      .json({ message: "Assignment attempt deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
