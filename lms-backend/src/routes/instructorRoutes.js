const express = require("express");
const router = express.Router();
const instructorController = require("../controllers/instructorController");

router.get("/:id", instructorController.getInstructorById);

module.exports = router;
