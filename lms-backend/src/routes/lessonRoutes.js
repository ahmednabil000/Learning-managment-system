const express = require("express");
const {
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonById,
  getLessonsByLectureId,
} = require("../controllers/lessonsController");
const router = express.Router();

router.post("/", createLesson);
router.put("/:id", updateLesson);
router.delete("/:id", deleteLesson);
router.get("/:id", getLessonById);
router.get("/:lectureId/lessons", getLessonsByLectureId);

module.exports = router;
