const Question = require("../../models/assessments/question");

exports.getQuestions = async (page, pageCount, search) => {
  return await Question.find({ title: { $regex: search } })
    .limit(pageCount)
    .skip((page - 1) * pageCount)
    .sort({ createdAt: -1 });
};

exports.getQuestionById = async (id) => {
  return await Question.findOne({ _id: id });
};

exports.createQuestion = async ({
  title,
  type,
  options,
  correctAnswer,
  points,
  assignmentId,
  examId,
}) => {
  return await Question.create({
    title,
    type,
    options,
    correctAnswer,
    points,
    assignment: assignmentId || null,
    exam: examId || null,
  });
};

exports.updateQuestionById = async (id, updateData) => {
  return await Question.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
  });
};

exports.deleteQuestionById = async (id) => {
  return await Question.findOneAndDelete({ _id: id });
};

exports.addQuestionToAssignment = async ({
  title,
  type,
  options,
  correctAnswer,
  points,
  assignmentId,
}) => {
  return await this.createQuestion({
    title,
    type,
    options,
    correctAnswer,
    points,
    assignmentId,
  });
};

exports.removeQuestionFromAssignment = async (questionId) => {
  return await Question.findOneAndUpdate(
    { _id: questionId },
    { assignment: null },
    { new: true }
  );
};

exports.addQuestionToExam = async ({
  title,
  type,
  options,
  correctAnswer,
  points,
  examId,
}) => {
  return await this.createQuestion({
    title,
    type,
    options,
    correctAnswer,
    points,
    examId,
  });
};

exports.removeQuestionFromExam = async (questionId) => {
  return await Question.findOneAndUpdate(
    { _id: questionId },
    { exam: null },
    { new: true }
  );
};
