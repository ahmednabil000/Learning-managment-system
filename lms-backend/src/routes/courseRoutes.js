const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/coursesController");
const authMiddleware = require("../middlewares/authMiddleware");
const optionalAuthMiddleware = require("../middlewares/optionalAuthMiddleware");

router.get("/", optionalAuthMiddleware, coursesController.getCourses);
router.get("/top", coursesController.getTopCourses);
router.get(
  "/my-courses",
  authMiddleware,
  coursesController.getMyEnrolledCourses
);
router.get("/instructor/:instructorId", coursesController.getInstructorCourses);
router.get("/:id", optionalAuthMiddleware, coursesController.getCourseById);
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

router.post("/:id/learning", authMiddleware, coursesController.addLearning);
router.delete(
  "/:id/learning/:index",
  authMiddleware,
  coursesController.removeLearning
);
router.put(
  "/:id/learning/:index",
  authMiddleware,
  coursesController.updateLearning
);

router.post(
  "/:id/requirements",
  authMiddleware,
  coursesController.addRequirement
);
router.delete(
  "/:id/requirements/:index",
  authMiddleware,
  coursesController.removeRequirement
);
router.put(
  "/:id/requirements/:index",
  authMiddleware,
  coursesController.updateRequirement
);

module.exports = router;
