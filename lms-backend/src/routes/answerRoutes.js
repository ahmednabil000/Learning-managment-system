const express = require("express");
const router = express.Router();
const answerController = require("../controllers/assessments/answerController");

// Basic CRUD
router.post("/", answerController.createAnswer);
router.get("/:id", answerController.getAnswerById);
router.put("/:id", answerController.updateAnswer);
router.delete("/:id", answerController.deleteAnswer);

// Get answers by attempt
router.get(
  "/exam-attempt/:examAttemptId",
  answerController.getAnswersByExamAttempt
);
router.get(
  "/assignment-attempt/:assignmentAttemptId",
  answerController.getAnswersByAssignmentAttempt
);

module.exports = router;
