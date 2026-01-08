const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");
const authMiddleware = require("../middlewares/authMiddleware");

// Exam management (Instructor only usually, checked in service)
router.post("/", authMiddleware, examController.createExam);
router.delete("/:examId", authMiddleware, examController.removeExam);
router.get(
  "/course/:courseId",
  authMiddleware,
  examController.getExamsByCourseId
);

// Questions management
router.post(
  "/:examId/questions",
  authMiddleware,
  examController.addQuestionToExam
);
router.delete(
  "/:examId/questions/:questionId",
  authMiddleware,
  examController.removeQuestionFromExam
);

// Student actions
router.get(
  "/course/:courseId/available",
  authMiddleware,
  examController.getCourseAvailableExam
);
router.get(
  "/:examId/duration",
  authMiddleware,
  examController.getExamRemainedDuration
); // Check remaining duration/eligibility

router.post("/:examId/attempt", authMiddleware, examController.addExamAttempt);
router.post(
  "/attempt/:examAttemptId/answer",
  authMiddleware,
  examController.addAnswerToAttempt
);
router.post(
  "/attempt/:examAttemptId/end",
  authMiddleware,
  examController.endExamAttempt
);
router.get(
  "/attempt/:examAttemptId",
  authMiddleware,
  examController.getExamAttemptById
);

module.exports = router;
