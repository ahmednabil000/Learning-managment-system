const LectureItem = require("../models/courses/lectureItem");
const { getLectureById } = require("./lectureService");
const Course = require("../models/courses/course");

exports.updateItemsOrder = async (userId, lectureId, updatesItems) => {
  const lecture = await getLectureById(lectureId);
  if (!lecture) {
    return { statusCode: 404, message: "Lecture not found" };
  }
  const course = await Course.findById(lecture.course);
  if (!course) {
    return { statusCode: 404, message: "Course not found" };
  }

  // Check if the user is the instructor of the course
  if (course.instructor.toString() !== userId) {
    return {
      statusCode: 403,
      message: "You are not authorized to update this lecture",
    };
  }

  if (!updatesItems || !Array.isArray(updatesItems)) {
    return { statusCode: 400, message: "Invalid updates items" };
  }

  const bulkOps = updatesItems.map((item) => ({
    updateOne: {
      filter: { _id: item.id, lecture: lectureId }, // Ensure item belongs to lecture
      update: { $set: { order: item.order } },
    },
  }));

  if (bulkOps.length > 0) {
    await LectureItem.bulkWrite(bulkOps);
  }

  return { statusCode: 200, message: "Items updated successfully" };
};
