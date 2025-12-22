const ExamAttempt = require("../../models/assessments/examAttempt");
const examService = require("./examService");
module.exports.createExamAttempt = async (examAttemptData) => {
  return await ExamAttempt.create(examAttemptData);
};

module.exports.getExamAttemptById = async (examAttemptId) => {
  return await ExamAttempt.findOne({ _id: examAttemptId })
    .populate("exam")
    .populate("student");
};

module.exports.getExamAttempts = async (examId, page, pageCount, userId) => {
  const examDoc = await examService.getExamById(examId);
  if (!examDoc) {
    throw new Error("Exam not found");
  }
  if (examDoc.instructor && examDoc.instructor.toString() !== userId) {
    throw new Error("You are not authorized to access this exam");
  }
  return await ExamAttempt.find({ exam: examDoc._id })
    .limit(pageCount)
    .skip((page - 1) * pageCount)
    .sort({ createdAt: -1 });
};

module.exports.getExamAttemptsCount = async (examId, userId) => {
  const examDoc = await examService.getExamById(examId);
  if (!examDoc) {
    throw new Error("Exam not found");
  }
  if (examDoc.instructor && examDoc.instructor.toString() !== userId) {
    throw new Error("You are not authorized to access this exam");
  }
  return await ExamAttempt.countDocuments({ exam: examDoc._id });
};

module.exports.updateExamAttemptById = async (examAttemptId, updateData) => {
  return await ExamAttempt.findOneAndUpdate(
    { _id: examAttemptId },
    updateData,
    {
      new: true,
    }
  );
};

module.exports.deleteExamAttemptById = async (examAttemptId) => {
  return await ExamAttempt.findOneAndDelete({ _id: examAttemptId });
};
