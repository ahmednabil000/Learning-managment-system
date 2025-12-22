const Assignment = require("../../models/assessments/assignment");

module.exports.createAssignment = async (assignmentData) => {
  return await Assignment.create(assignmentData);
};

module.exports.getAssignmentById = async (id) => {
  return await Assignment.findOne({ _id: id });
};

module.exports.getAssignments = async (page, pageCount, search) => {
  return await Assignment.find({ title: { $regex: search } })
    .limit(pageCount)
    .skip((page - 1) * pageCount)
    .sort({ createdAt: -1 });
};

module.exports.updateAssignmentById = async (id, updateData) => {
  return await Assignment.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
  });
};

module.exports.deleteAssignmentById = async (id) => {
  return await Assignment.findOneAndDelete({ _id: id });
};
