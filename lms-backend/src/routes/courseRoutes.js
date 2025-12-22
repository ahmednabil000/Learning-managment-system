const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/coursesController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", coursesController.getCourses);
router.get("/:id", coursesController.getCourseById);
router.post("/", authMiddleware, coursesController.createCourse);
router.put("/:id", authMiddleware, coursesController.updateCourseById);
router.delete("/:id", authMiddleware, coursesController.deleteCourseById);

module.exports = router;
