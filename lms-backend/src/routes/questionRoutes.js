const express = require("express");
const router = express.Router();
const questionController = require("../controllers/assessments/questionController");

// Basic CRUD
router.post("/", questionController.createQuestion);
router.get("/", questionController.getQuestions);
router.get("/:id", questionController.getQuestionById);
router.put("/:id", questionController.updateQuestion);
router.delete("/:id", questionController.deleteQuestion);

// Assignment-specific routes
router.post(
  "/assignment/:assignmentId",
  questionController.addQuestionToAssignment
);
router.delete(
  "/:questionId/assignment",
  questionController.removeQuestionFromAssignment
);

// Exam-specific routes
router.post("/exam/:examId", questionController.addQuestionToExam);
router.delete("/:questionId/exam", questionController.removeQuestionFromExam);

module.exports = router;
