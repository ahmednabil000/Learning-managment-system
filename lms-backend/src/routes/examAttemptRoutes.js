const express = require("express");
const router = express.Router();
const examAttemptController = require("../controllers/assessments/examAttemptController");

// Basic CRUD
router.post("/", examAttemptController.createExamAttempt);
router.get("/:id", examAttemptController.getExamAttemptById);
router.put("/:id", examAttemptController.updateExamAttempt);
router.delete("/:id", examAttemptController.deleteExamAttempt);

// Exam-specific routes (require authorization)
router.get("/exam/:examId", examAttemptController.getExamAttempts);
router.get("/exam/:examId/count", examAttemptController.getExamAttemptsCount);

module.exports = router;
