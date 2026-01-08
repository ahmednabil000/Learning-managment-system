const instructorService = require("../services/instructorService");
const logger = require("../config/logger");
module.exports.getInstructorById = async (req, res) => {
  try {
    logger.info("Getting instructor by ID");
    const instructor = await instructorService.getInstructorById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }
    logger.info("Instructor found");
    res.json(instructor);
  } catch (error) {
    logger.error("Error getting instructor by ID", error);
    res.status(500).json({ message: error.message });
  }
};
