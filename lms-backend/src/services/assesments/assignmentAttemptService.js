const AssignmentAttempt = require("../../models/assessments/assignmentAttempt");
const assignmentService = require("./assignmentService");

module.exports.createAssignmentAttempt = async (assignmentAttemptData) => {
  return await AssignmentAttempt.create(assignmentAttemptData);
};

module.exports.getAssignmentAttemptById = async (assignmentAttemptId) => {
  return await AssignmentAttempt.findById(assignmentAttemptId)
    .populate("assignment")
    .populate("student");
};

module.exports.getAssignmentAttempts = async (
  assignmentId,
  page,
  pageCount,
  userId
) => {
  const assignmentDoc = await assignmentService.getAssignmentById(assignmentId);
  if (!assignmentDoc) {
    throw new Error("Assignment not found");
  }
  if (
    assignmentDoc.instructor &&
    assignmentDoc.instructor.toString() !== userId
  ) {
    throw new Error("You are not authorized to access this assignment");
  }
  return await AssignmentAttempt.find({ assignment: assignmentId })
    .limit(pageCount)
    .skip((page - 1) * pageCount)
    .sort({ createdAt: -1 });
};

module.exports.getAssignmentAttemptsCount = async (assignmentId, userId) => {
  const assignmentDoc = await assignmentService.getAssignmentById(assignmentId);
  if (!assignmentDoc) {
    throw new Error("Assignment not found");
  }
  if (
    assignmentDoc.instructor &&
    assignmentDoc.instructor.toString() !== userId
  ) {
    throw new Error("You are not authorized to access this assignment");
  }
  return await AssignmentAttempt.countDocuments({ assignment: assignmentId });
};

module.exports.updateAssignmentAttemptById = async (
  assignmentAttemptId,
  updateData
) => {
  return await AssignmentAttempt.findByIdAndUpdate(
    assignmentAttemptId,
    updateData,
    {
      new: true,
    }
  );
};

module.exports.deleteAssignmentAttemptById = async (assignmentAttemptId) => {
  return await AssignmentAttempt.findByIdAndDelete(assignmentAttemptId);
};
