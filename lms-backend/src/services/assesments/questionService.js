const Question = require("../../models/assessments/question");
const UserEnroll = require("../../models/UserEnroll");
const Lecture = require("../../models/courses/Lecture");
const Course = require("../../models/courses/course");
exports.getQuestions = async (page, pageCount, search) => {
  return await Question.find({ title: { $regex: search } })
    .limit(pageCount)
    .skip((page - 1) * pageCount)
    .sort({ createdAt: -1 });
};

exports.getQuestionById = async (userId, id) => {
  const question = await Question.findOne({ _id: id }).populate("assignment");
  const lecture = await Lecture.findOne({ _id: question.assignment.lecture });
  const course = await Course.findOne({ _id: lecture.course });
  const userEnroll = await UserEnroll.findOne({
    course: course._id,
    user: userId,
  });
  if (!userEnroll) {
    return {
      statusCode: 403,
      message: "You are not authorized to access this question",
    };
  }
  if (!question) {
    return {
      statusCode: 404,
      message: "Question not found",
    };
  }

  return { question, lecture, course };
};

exports.createQuestion = async ({
  title,
  type,
  options,
  correctAnswer,
  points,
  assignment,
  exam,
}) => {
  return await Question.create({
    title,
    type,
    options,
    correctAnswer,
    points,
    assignment: assignment || null,
    exam: exam || null,
  });
};

exports.updateQuestionById = async (id, updateData) => {
  console.log("testing");
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

exports.getQuestionsByAssignmentId = async (assignmentId) => {
  console.log(assignmentId);
  return await Question.find({ assignment: assignmentId });
};

exports.getQuestionsByExamId = async (examId) => {
  return await Question.find({ exam: examId });
};
