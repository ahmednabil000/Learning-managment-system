const CourseSale = require("../models/courses/courseSale");

async function deactivateExpiredCourseSales() {
  try {
    const result = await CourseSale.updateMany(
      {
        status: "active",
        endDate: { $lt: new Date() },
      },
      { $set: { status: "inactive" } }
    );

    if (result.modifiedCount > 0) {
    }
  } catch (error) {
    console.error(
      "[Cron Error] Failed to deactivate expired course sales:",
      error
    );
  }
}

module.exports = deactivateExpiredCourseSales;
