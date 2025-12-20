const examService = require("../../services/assesments/examService");
const examValidator = require("../../validations/assessments/examValidator");
const paginationValidator = require("../../validations/paginationValidator");

module.exports.createExam = async (req, res) => {
  try {
    const { error, value } = examValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const exam = await examService.createExam(value);
    return res.status(201).json(exam);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getExamById = async (req, res) => {
  try {
    const exam = await examService.getExamById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    return res.status(200).json(exam);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getExams = async (req, res) => {
  try {
    const { page, pageCount, search } = await paginationValidator.validateAsync(
      req.query
    );

    const exams = await examService.getExams(page, pageCount, search);
    const totalItems = exams.length;
    const totalPages = Math.ceil(totalItems / pageCount);

    res.json({
      exams,
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

module.exports.updateExam = async (req, res) => {
  try {
    const { error, value } = examValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const exam = await examService.updateExamById(req.params.id, value);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    return res.status(200).json(exam);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.deleteExam = async (req, res) => {
  try {
    const exam = await examService.deleteExamById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    return res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
