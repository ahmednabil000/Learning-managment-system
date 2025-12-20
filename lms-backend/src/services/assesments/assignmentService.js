const Assignment = require("../../models/assessments/assignment");

module.exports.createAssignment = async (assignmentData) => {
  return await Assignment.create(assignmentData);
};

module.exports.getAssignmentById = async (id) => {
  return await Assignment.findById(id);
};

module.exports.getAssignments = async (page, pageCount, search) => {
  return await Assignment.find({ title: { $regex: search } })
    .limit(pageCount)
    .skip((page - 1) * pageCount)
    .sort({ createdAt: -1 });
};

module.exports.updateAssignmentById = async (id, updateData) => {
  return await Assignment.findByIdAndUpdate(id, updateData, { new: true });
};

module.exports.deleteAssignmentById = async (id) => {
  return await Assignment.findByIdAndDelete(id);
};
