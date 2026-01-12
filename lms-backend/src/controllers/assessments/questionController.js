const questionService = require("../../services/assesments/questionService");
const questionValidator = require("../../validations/assessments/questionValidator");
const paginationValidator = require("../../validations/paginationValidator");
const logger = require("../../config/logger");
module.exports.createQuestion = async (req, res) => {
  try {
    logger.info("Start creating question");
    const { error, value } = questionValidator.validate(req.body);

    if (error) {
      logger.error(error.details[0].message);
      return res.status(400).json({ message: error.details[0].message });
    }
    const question = await questionService.createQuestion(value);
    logger.info("Question created successfully");
    return res.status(201).json(question);
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getQuestionById = async (req, res) => {
  try {
    const result = await questionService.getQuestionById(
      req.user.id,
      req.params.id
    );
    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    return res.status(200).json(result.question);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getQuestions = async (req, res) => {
  try {
    logger.info("Start fetching questions");
    const { error, value } = paginationValidator.validate(req.query);
    if (error) {
      logger.error(error.details[0].message);
      return res.status(400).json({ message: error.details[0].message });
    }
    const { page, pageCount, search } = value;
    logger.info("End fetching questions");
    const questions = await questionService.getQuestions(
      page,
      pageCount,
      search
    );
    logger.info("End fetching questions");
    const totalItems = questions.length;
    const totalPages = Math.ceil(totalItems / pageCount);

    res.json({
      questions,
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

module.exports.updateQuestion = async (req, res) => {
  try {
    const { error, value } = questionValidator.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const question = await questionService.updateQuestionById(
      req.params.id,
      value
    );
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    return res.status(200).json(question);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.deleteQuestion = async (req, res) => {
  try {
    const question = await questionService.deleteQuestionById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.addQuestionToAssignment = async (req, res) => {
  try {
    const { error, value } = questionValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const question = await questionService.addQuestionToAssignment({
      ...value,
      assignmentId: req.params.assignmentId,
    });
    return res.status(201).json(question);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.addQuestionToExam = async (req, res) => {
  try {
    const { error, value } = questionValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const question = await questionService.addQuestionToExam({
      ...value,
      examId: req.params.examId,
    });
    return res.status(201).json(question);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.removeQuestionFromAssignment = async (req, res) => {
  try {
    const question = await questionService.removeQuestionFromAssignment(
      req.params.questionId
    );
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    return res.status(200).json(question);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.removeQuestionFromExam = async (req, res) => {
  try {
    const question = await questionService.removeQuestionFromExam(
      req.params.questionId
    );
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    return res.status(200).json(question);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getQuestionsByAssignmentId = async (req, res) => {
  try {
    logger.info("Start fetching questions by assignment id");
    const questions = await questionService.getQuestionsByAssignmentId(
      req.params.assignmentId
    );
    logger.info("End fetching questions by assignment id");
    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getQuestionsByExamId = async (req, res) => {
  try {
    logger.info("Start fetching questions by exam id");
    const questions = await questionService.getQuestionsByExamId(
      req.params.examId
    );
    logger.info("End fetching questions by exam id");
    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
