const Lesson = require("../models/courses/lesson");
const UserEnroll = require("../models/UserEnroll");

module.exports.createLesson = async ({
  title,
  description,
  lectureId,
  course,
  order,
  duration,
  videoUrl,
  isOpen,
}) => {
  const lesson = await Lesson.create({
    title,
    description,
    lecture: lectureId,
    course,
    order,
    duration,
    videoUrl,
    isOpen,
  });
  return lesson;
};

module.exports.updateLesson = async ({
  id,
  title,
  description,
  lectureId,
  course,
  order,
  duration,
  videoUrl,
  isOpen,
}) => {
  const lesson = await Lesson.findOne({ _id: id });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  lesson.title = title;
  lesson.description = description;
  lesson.lecture = lectureId;
  lesson.course = course;
  lesson.order = order;
  lesson.duration = duration;
  lesson.videoUrl = videoUrl;
  lesson.isOpen = isOpen;

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

module.exports.getLessonById = async (id, userId) => {
  const lesson = await Lesson.findOne({ _id: id });

  if (!lesson) {
    return { status: 404, message: "Lesson not found" };
  }

  if (lesson.isOpen) {
    return { status: 200, lesson };
  }

  if (!userId) {
    return { status: 401, message: "Unauthorized" };
  }

  const userEnroll = await UserEnroll.findOne({
    user: userId,
    course: lesson.course,
  });

  if (!userEnroll) {
    return { status: 403, message: "You are not enrolled in this course" };
  }
  return { status: 200, lesson };
};

module.exports.getLessonsByLectureId = async (lectureId) => {
  const lessons = await Lesson.find({ lecture: lectureId });
  return lessons;
};
