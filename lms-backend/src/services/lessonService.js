const mongoose = require("mongoose");
const Lesson = require("../models/courses/lesson");

module.exports.createLesson = async ({
  title,
  description,
  lectureId,
  order,
  duration,
  videoUrl,
}) => {
  const lesson = await Lesson.create({
    title,
    description,
    lecture: lectureId,
    order,
    duration,
    videoUrl,
  });
  return lesson;
};

module.exports.updateLesson = async ({
  id,
  title,
  description,
  lectureId,
  order,
  duration,
  videoUrl,
}) => {
  const lesson = await Lesson.findOne({ id });

  if (!lesson) {
    throw error("Lesson not found");
  }

  lesson.title = title;
  lesson.description = description;
  lesson.lecture = lectureId;
  lesson.order = order;
  lesson.duration = duration;
  lesson.videoUrl = videoUrl;

  await lesson.save();

  return lesson;
};

module.exports.deleteLesson = async (id) => {
  const lesson = await Lesson.findOne({ _id: id });

  if (!lesson) {
    throw error("Lesson not found");
  }

  await lesson.remove();
  return lesson;
};

module.exports.getLessonById = async (id) => {
  const lesson = await Lesson.findOne({ _id: id });
  return lesson;
};

module.exports.getLessonsByLectureId = async (lectureId) => {
  const lessons = await Lesson.find({ lecture: lectureId });
  return lessons;
};
