const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/coursesController");

router.get("/", coursesController.getCourses);
router.get("/:id", coursesController.getCourseById);
router.post("/", coursesController.createCourse);
router.put("/:id", coursesController.updateCourseById);
router.delete("/:id", coursesController.deleteCourseById);

module.exports = router;