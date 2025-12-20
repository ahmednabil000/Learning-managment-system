const Exam = require("../../models/assessments/exam");

module.exports.createExam = async (examData) => {
  return await Exam.create(examData);
};

module.exports.getExamById = async (id) => {
  return await Exam.findById(id);
};

module.exports.getExams = async (page, pageCount, search) => {
  return await Exam.find({ title: { $regex: search } })
    .limit(pageCount)
    .skip((page - 1) * pageCount)
    .sort({ createdAt: -1 });
};

module.exports.updateExamById = async (id, updateData) => {
  return await Exam.findByIdAndUpdate(id, updateData, { new: true });
};

module.exports.deleteExamById = async (id) => {
  return await Exam.findByIdAndDelete(id);
};
