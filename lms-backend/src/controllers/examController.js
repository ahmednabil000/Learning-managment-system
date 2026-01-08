const examService = require("../services/examService");
const examValidator = require("../validations/assessments/examValidator");
const logger = require("../config/logger");

module.exports.createExam = async (req, res) => {
  try {
    const { error } = examValidator.validate({
      ...req.body,
      instructor: req.user.id,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const result = await examService.createExam(req.user.id, req.body);
    res.status(result.statusCode).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.addQuestionToExam = async (req, res) => {
  try {
    const result = await examService.addQuestionToExam(
      req.user.id,
      req.params.examId,
      req.body
    );
    res.status(result.statusCode).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.removeQuestionFromExam = async (req, res) => {
  try {
    const result = await examService.removeQuestionFromExam(
      req.user.id,
      req.params.examId,
      req.params.questionId
    );
    res.status(result.statusCode).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.removeExam = async (req, res) => {
  try {
    const result = await examService.removeExam(req.user.id, req.params.examId);
    res.status(result.statusCode).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.addExamAttempt = async (req, res) => {
  try {
    const result = await examService.addExamAttempt(
      req.user.id,
      req.params.examId,
      req.body
    );
    res.status(result.statusCode).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.addAnswerToAttempt = async (req, res) => {
  try {
    const result = await examService.addAnswerToAttempt(
      req.user.id,
      req.params.examAttemptId,
      req.body.questionId,
      req.body.answer
    );
    res.status(result.statusCode).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getExamRemainedDuration = async (req, res) => {
  try {
    const result = await examService.getExamRemainedDuration(
      req.user.id,
      req.params.examId
    );
    res.status(result.statusCode).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getCourseAvailableExam = async (req, res) => {
  try {
    logger.info("start getCourseAvailableExam");
    const result = await examService.getCourseAvailableExam(
      req.user.id,
      req.params.courseId
    );
    console.log(result);
    logger.info("end getCourseAvailableExam");
    res.status(result.statusCode).json(result);
  } catch (err) {
    logger.error("end getCourseAvailableExam", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports.endExamAttempt = async (req, res) => {
  try {
    const result = await examService.endExamAttempt(
      req.params.examAttemptId,
      req.user.id
    );
    res.status(result.statusCode).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getExamAttemptById = async (req, res) => {
  try {
    const result = await examService.getExamAttemptById(
      req.user.id,
      req.params.examAttemptId
    );
    res.status(result.statusCode).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getExamsByCourseId = async (req, res) => {
  try {
    logger.info("start getExamsByCourseId");
    const result = await examService.getExamsByCourseId(
      req.user.id,
      req.params.courseId
    );
    console.log(result);
    logger.info("end getExamsByCourseId");
    res.status(result.statusCode).json(result);
  } catch (err) {
    logger.error("end getExamsByCourseId", err);
    res.status(500).json({ message: err.message });
  }
};
