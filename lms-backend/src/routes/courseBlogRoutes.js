const express = require("express");
const router = express.Router();
const courseBlogController = require("../controllers/courseBlogController");
const authMiddleware = require("../middlewares/authMiddleware");

// Get all blogs (for a specific course)
router.get("/course/:courseId", courseBlogController.getAllCourseBlogs);

// Create a new blog
router.post("/", authMiddleware, courseBlogController.createCourseBlog);

// Get a single blog by ID
router.get("/:id", authMiddleware, courseBlogController.getCourseBlogById);

// Update a blog
router.put("/:id", authMiddleware, courseBlogController.updateCourseBlog);

// Delete a blog
router.delete("/:id", authMiddleware, courseBlogController.deleteCourseBlog);

module.exports = router;
