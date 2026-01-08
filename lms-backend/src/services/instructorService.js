const { Instructor } = require("../models/user");

module.exports.getInstructorById = async (instructorId) => {
  const instructor = await Instructor.findOne({ _id: instructorId }).select(
    "-email"
  );
  return instructor;
};
