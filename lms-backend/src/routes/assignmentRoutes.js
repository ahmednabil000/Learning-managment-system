const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assessments/assignmentController");

router.post("/", assignmentController.createAssignment);
router.get("/", assignmentController.getAssignments);
router.get("/:id", assignmentController.getAssignmentById);
router.put("/:id", assignmentController.updateAssignment);
router.delete("/:id", assignmentController.deleteAssignment);

module.exports = router;
