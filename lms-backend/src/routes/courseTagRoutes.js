const express = require("express");
const router = express.Router();
const courseTagController = require("../controllers/courseTagController");

router.get("/", courseTagController.getAllTags);
router.get("/:id", courseTagController.getTagById);
router.post("/", courseTagController.createTag);
router.put("/:id", courseTagController.updateTag);
router.delete("/:id", courseTagController.deleteTag);

module.exports = router;
