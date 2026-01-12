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
exports.updateInstructorById = async (req, res) => {
  try {
    logger.info("Updating instructor by ID");
    const { firstName, lastName, description } = req.body;

    // Use req.user.id directly as the instructor ID to update
    const result = await instructorService.updateInstructorById(req.user.id, {
      firstName,
      lastName,
      description,
    });

    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }

    logger.info("Instructor updated successfully");
    res.json(result);
  } catch (error) {
    logger.error("Error updating instructor by ID", error);
    res.status(500).json({ message: error.message });
  }
};
