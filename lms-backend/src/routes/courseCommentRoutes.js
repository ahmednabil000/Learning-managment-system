const express = require("express");
const router = express.Router();
const courseCommentController = require("../controllers/courseCommentController");
const authMiddleware = require("../middlewares/authMiddleware");

// Helper to allow getting comments without auth, but requiring auth for modifications
// Assuming comments might be public. If not, apply authMiddleware strictly.
// For now, let's strictly apply auth for writes and reads as per typical secure design,
// or allow public reads for course details. Let's make reads public.

router.get(
  "/course/:courseId",
  courseCommentController.getCourseCommentsByCourseId
);
router.get("/course/:courseId/rate", courseCommentController.getCourseRate);
router.get("/:id", courseCommentController.getCourseCommentById);

router.post("/", authMiddleware, courseCommentController.createCourseComment);
router.put("/:id", authMiddleware, courseCommentController.updateCourseComment);
router.delete(
  "/:id",
  authMiddleware,
  courseCommentController.deleteCourseComment
);

module.exports = router;
