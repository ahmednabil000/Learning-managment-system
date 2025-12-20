const express = require("express");
const router = express.Router();
const assignmentAttemptController = require("../controllers/assessments/assignmentAttemptController");

// Basic CRUD
router.post("/", assignmentAttemptController.createAssignmentAttempt);
router.get("/:id", assignmentAttemptController.getAssignmentAttemptById);
router.put("/:id", assignmentAttemptController.updateAssignmentAttempt);
router.delete("/:id", assignmentAttemptController.deleteAssignmentAttempt);

// Assignment-specific routes (require authorization)
router.get(
  "/assignment/:assignmentId",
  assignmentAttemptController.getAssignmentAttempts
);
router.get(
  "/assignment/:assignmentId/count",
  assignmentAttemptController.getAssignmentAttemptsCount
);

module.exports = router;
