const express = require("express");
const router = express.Router();
const instructorController = require("../controllers/instructorController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/:id", instructorController.getInstructorById);
router.put("/", authMiddleware, instructorController.updateInstructorById);

module.exports = router;
