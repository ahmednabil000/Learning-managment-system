const CourseSale = require("../models/courses/courseSale");

async function deactivateExpiredCourseSales() {
  try {
    console.log("[Cron] Checking for expired course sales...");
    const result = await CourseSale.updateMany(
      {
        status: "active",
        endDate: { $lt: new Date() },
      },
      { $set: { status: "inactive" } }
    );

    if (result.modifiedCount > 0) {
      console.log(
        `[Cron] Deactivated ${result.modifiedCount} expired course sales.`
      );
    }
  } catch (error) {
    console.error(
      "[Cron Error] Failed to deactivate expired course sales:",
      error
    );
  }
}

module.exports = deactivateExpiredCourseSales;
