const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assessments/assignmentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/by-course", assignmentController.getAssignmentsByCourseId);
router.post("/", authMiddleware, assignmentController.createAssignment);
router.get("/", assignmentController.getAssignments);
router.get(
  "/by-lecture/:lectureId",
  assignmentController.getAssignmentsByLectureId
);
router.get("/:id", authMiddleware, assignmentController.getAssignmentById);
router.put("/:id", authMiddleware, assignmentController.updateAssignment);
router.delete("/:id", authMiddleware, assignmentController.deleteAssignment);

module.exports = router;
