const Exam = require("../models/courses/exam");

async function updateExamStatus() {
  try {
    const exams = await Exam.find({ status: "not-started" });
    for (const exam of exams) {
      if (exam.startDate <= Date.now()) {
        await Exam.updateOne(
          { _id: exam._id },
          { $set: { status: "started" } }
        );
      } else if (exam.startDate + exam.duration * 60 * 1000 <= Date.now()) {
        await Exam.updateOne({ _id: exam._id }, { $set: { status: "ended" } });
      }
    }
  } catch (error) {
    console.error("[Cron Error] Failed to update exam statuses:", error);
  }
}

module.exports = updateExamStatus;
