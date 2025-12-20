const examAttemptService = require("../../services/assesments/examAttemptService");
const examAttemptValidator = require("../../validations/assessments/examAttemptValidator");

module.exports.createExamAttempt = async (req, res) => {
  try {
    const { error, value } = examAttemptValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const examAttempt = await examAttemptService.createExamAttempt(value);
    return res.status(201).json(examAttempt);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getExamAttemptById = async (req, res) => {
  try {
    const examAttempt = await examAttemptService.getExamAttemptById(
      req.params.id
    );
    if (!examAttempt) {
      return res.status(404).json({ message: "Exam attempt not found" });
    }
    return res.status(200).json(examAttempt);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getExamAttempts = async (req, res) => {
  try {
    const { page = 1, pageCount = 10 } = req.query;
    const userId = req.user?.id; // Assuming user is attached to request by auth middleware

    const examAttempts = await examAttemptService.getExamAttempts(
      req.params.examId,
      parseInt(page),
      parseInt(pageCount),
      userId
    );

    return res.status(200).json(examAttempts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getExamAttemptsCount = async (req, res) => {
  try {
    const userId = req.user?.id; // Assuming user is attached to request by auth middleware

    const count = await examAttemptService.getExamAttemptsCount(
      req.params.examId,
      userId
    );

    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.updateExamAttempt = async (req, res) => {
  try {
    const { error, value } = examAttemptValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const examAttempt = await examAttemptService.updateExamAttemptById(
      req.params.id,
      value
    );
    if (!examAttempt) {
      return res.status(404).json({ message: "Exam attempt not found" });
    }
    return res.status(200).json(examAttempt);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.deleteExamAttempt = async (req, res) => {
  try {
    const examAttempt = await examAttemptService.deleteExamAttemptById(
      req.params.id
    );
    if (!examAttempt) {
      return res.status(404).json({ message: "Exam attempt not found" });
    }
    return res
      .status(200)
      .json({ message: "Exam attempt deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
