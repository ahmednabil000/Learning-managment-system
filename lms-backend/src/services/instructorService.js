const { Instructor } = require("../models/user");

module.exports.getInstructorById = async (instructorId) => {
  const instructor = await Instructor.findOne({ _id: instructorId }).select(
    "-email"
  );
  return instructor;
};

module.exports.updateInstructorById = async (
  instructorId,
  { firstName, lastName, description }
) => {
  const instructor = await Instructor.findOne({ _id: instructorId }).select(
    "-email"
  );

  if (!instructor) {
    return { statusCode: 404, message: "Instructor not found" };
  }

  if (firstName) instructor.name = firstName;
  if (lastName) instructor.name += " " + lastName;
  if (description) instructor.description = description;

  await instructor.save();
  return instructor;
};
