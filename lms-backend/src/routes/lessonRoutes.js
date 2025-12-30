const express = require("express");
const {
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonById,
  getLessonsByLectureId,
} = require("../controllers/lessonsController");
const authMiddleware = require("../middlewares/authMiddleware");
const optionalAuthMiddleware = require("../middlewares/optionalAuthMiddleware");
const router = express.Router();

router.post("/", authMiddleware, createLesson);
router.put("/:id", authMiddleware, updateLesson);
router.delete("/:id", authMiddleware, deleteLesson);
router.get("/:id", optionalAuthMiddleware, getLessonById);
router.get("/:lectureId/lessons", getLessonsByLectureId);

module.exports = router;
