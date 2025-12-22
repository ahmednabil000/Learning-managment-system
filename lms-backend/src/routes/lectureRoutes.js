const express = require("express");
const {
  createLecture,
  updateLecture,
  deleteLecture,
  getLectureById,
  getLectures,
  getCourseLectures,
  addLessonToLecture,
  deleteLessonFromLecture,
} = require("../controllers/lecturesController");
const router = express.Router();

router.post("/", createLecture);
router.put("/:id", updateLecture);
router.delete("/:id", deleteLecture);
router.get("/course/:courseId", getCourseLectures);
router.get("/:id", getLectureById);
router.get("/", getLectures);
router.post("/:lectureId/lessons", addLessonToLecture);
router.delete("/:lectureId/lessons/:lessonId", deleteLessonFromLecture);

module.exports = router;
