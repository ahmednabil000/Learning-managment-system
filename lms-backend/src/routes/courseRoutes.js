const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/coursesController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", coursesController.getCourses);
router.get("/:id", coursesController.getCourseById);
router.post("/", authMiddleware, coursesController.createCourse);
router.put("/:id", authMiddleware, coursesController.updateCourseById);
router.delete("/:id", authMiddleware, coursesController.deleteCourseById);
router.post(
  "/:courseId/discount",
  authMiddleware,
  coursesController.addCourseDiscount
);
router.delete(
  "/:courseId/discount",
  authMiddleware,
  coursesController.removeCourseDiscount
);

module.exports = router;
