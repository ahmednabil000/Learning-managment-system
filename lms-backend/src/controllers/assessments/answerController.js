const answerService = require("../../services/assesments/answerService");
const answerValidator = require("../../validations/assessments/answerValidator");

module.exports.createAnswer = async (req, res) => {
  try {
    const { error, value } = answerValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const answer = await answerService.createAnswer(value);
    return res.status(201).json(answer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getAnswerById = async (req, res) => {
  try {
    const answer = await answerService.getAnswerById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }
    return res.status(200).json(answer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getAnswersByExamAttempt = async (req, res) => {
  try {
    const answers = await answerService.getAnswersByExamAttempt(
      req.params.examAttemptId
    );
    return res.status(200).json(answers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getAnswersByAssignmentAttempt = async (req, res) => {
  try {
    const answers = await answerService.getAnswersByAssignmentAttempt(
      req.params.assignmentAttemptId
    );
    return res.status(200).json(answers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.updateAnswer = async (req, res) => {
  try {
    const { error, value } = answerValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const answer = await answerService.updateAnswerById(req.params.id, value);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }
    return res.status(200).json(answer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.deleteAnswer = async (req, res) => {
  try {
    const answer = await answerService.deleteAnswerById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }
    return res.status(200).json({ message: "Answer deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
