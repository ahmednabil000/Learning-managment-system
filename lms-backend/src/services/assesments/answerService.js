const Answer = require("../../models/assessments/answer");

module.exports.createAnswer = async (answerData) => {
  return await Answer.create(answerData);
};

module.exports.getAnswerById = async (answerId) => {
  return await Answer.findById(answerId);
};

module.exports.getAnswersByExamAttempt = async (examAttemptId) => {
  return await Answer.find({ examAttempt: examAttemptId }).populate("question");
};

module.exports.getAnswersByAssignmentAttempt = async (assignmentAttemptId) => {
  return await Answer.find({ assignmentAttempt: assignmentAttemptId }).populate(
    "question"
  );
};

module.exports.updateAnswerById = async (answerId, updateData) => {
  return await Answer.findByIdAndUpdate(answerId, updateData, {
    new: true,
  });
    };

module.exports.deleteAnswerById = async (answerId) => {
  return await Answer.findByIdAndDelete(answerId);
};


