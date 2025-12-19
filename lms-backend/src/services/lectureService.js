const mongoose = require("mongoose");
const Lecture = require("../models/courses/Lecture");

exports.createLecture = async ({ title, description, courseId, order }) => {
  const lecture = await Lecture.create({
    title,
    description,
    course: courseId,
    order,
  });
  return lecture;
};

exports.updateLecture = async ({ id, title, description, courseId, order }) => {
  const lecture = await Lecture.findById(id);

  if (!lecture) {
    throw error("Lecture not found");
  }

  lecture.title = title;
  lecture.description = description;
  lecture.course = courseId;
  lecture.order = order;

  await lecture.save();

  return lecture;
};

exports.deleteLecture = async (id) => {
  const lecture = await Lecture.findById(id);

  if (!lecture) {
    throw error("Lecture not found");
  }

  await lecture.remove();
  return lecture;
};

exports.addLessonToLecture = async ({ lectureId, lessonId }) => {
  const lecture = await Lecture.findById(lectureId);

  if (!lecture) {
    throw error("Lecture not found");
  }

  lecture.lessons.push(lessonId);

  await lecture.save();

  return lecture;
};

exports.deleteLessonFromLecture = async ({ lectureId, lessonId }) => {
  const lecture = await Lecture.findById(lectureId);

  if (!lecture) {
    throw error("Lecture not found");
  }

  lecture.lessons.pull(lessonId);

  await lecture.save();

  return lecture;
};

exports.getLectureById = async (id) => {
  const lecture = await Lecture.findById(id).populate("lessons");
  return lecture;
};

exports.getAllLectures = async (page, pageCount, search) => {
  const lectures = await Lecture.find({
    title: { $regex: search, $options: "i" },
  })
    .skip((page - 1) * pageCount)
    .limit(pageCount)
    .populate("lessons");

  const totalItems = await Lecture.countDocuments({
    title: { $regex: search, $options: "i" },
  });
  const totalPages = Math.ceil(totalItems / pageCount);

  return {
    lectures,
    totalItems,
    totalPages,
  };
};
