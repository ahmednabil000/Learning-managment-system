import { useParams, useNavigate, Link } from "react-router-dom";
import { useCourse } from "../../hooks/useCourses";
import { useLesson } from "../../hooks/useLessons";
import { useTranslation } from "react-i18next";
import {
  FaChevronLeft,
  FaChevronDown,
  FaChevronUp,
  FaPlayCircle,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { useState } from "react";
import { formatDuration } from "../../utils/formatDuration";
import ReactPlayer from "react-player";
import CommentsSection from "./components/CommentsSection";

const LessonViewPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: currentLesson, isLoading: lessonLoading } = useLesson(lessonId);
  const [expandedLectures, setExpandedLectures] = useState({});

  const toggleLecture = (lectureId) => {
    setExpandedLectures((prev) => ({
      ...prev,
      [lectureId]: !prev[lectureId],
    }));
  };

  // Find current lesson's lecture for auto-expand
  const currentLectureId = course?.lectures?.find((lecture) =>
    lecture.lessons?.some((lesson) => lesson._id === lessonId)
  )?._id;

  // Auto-expand current lecture
  if (currentLectureId && !expandedLectures[currentLectureId]) {
    setExpandedLectures((prev) => ({
      ...prev,
      [currentLectureId]: true,
    }));
  }

  const handleLessonClick = (newLessonId) => {
    navigate(`/courses/${courseId}/lessons/${newLessonId}`);
  };

  if (courseLoading || lessonLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="heading-l text-error mb-4">
          {t("course_details.error_loading")}
        </h2>
        <Link to="/courses">
          <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
            {t("course_details.back_to_courses")}
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to={`/courses/${courseId}`}
              className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
            >
              <FaChevronLeft
                className={`${
                  isRtl ? "rotate-180" : ""
                } mr-2 rtl:ml-2 rtl:mr-0`}
              />
              <span className="font-medium">{course.title}</span>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900 hidden md:block truncate max-w-md">
              {currentLesson.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] h-[calc(100vh-73px)]">
          {/* Left Column: Video + Info + Comments */}
          <div className="flex flex-col overflow-y-auto bg-gray-50">
            {/* Video Player */}
            <div className="w-full bg-black aspect-video shrink-0">
              {currentLesson.videoUrl ? (
                <ReactPlayer
                  src={currentLesson.videoUrl}
                  controls={true}
                  width="100%"
                  height="100%"
                  playing={false}
                  config={{
                    file: {
                      attributes: {
                        controlsList: "nodownload",
                      },
                    },
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-8">
                  <FaPlayCircle size={64} className="mb-4 opacity-40" />
                  <p className="text-lg">No video available for this lesson</p>
                </div>
              )}
            </div>

            {/* Lesson Info */}
            <div className="bg-white border-b border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentLesson.title}
              </h2>
              {currentLesson.description && (
                <p className="text-gray-600 leading-relaxed">
                  {currentLesson.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <FaClock />
                  {formatDuration(currentLesson.duration || 0).formatted}
                </span>
              </div>
            </div>

            {/* Comments Section */}
            <div className="p-6">
              <CommentsSection lectureId={currentLectureId} />
            </div>
          </div>

          {/* Sidebar - Course Content */}
          <div className="bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">
                Course Content
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {course.lectures?.reduce(
                  (acc, lecture) => acc + (lecture.lessons?.length || 0),
                  0
                )}{" "}
                lessons
              </p>
            </div>

            <div className="p-3 space-y-2">
              {course.lectures
                ?.sort((a, b) => a.order - b.order)
                .map((lecture) => (
                  <div
                    key={lecture._id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleLecture(lecture._id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {lecture.order}
                        </div>
                        <div className="text-left min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                            {lecture.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {lecture.lessons?.length || 0} lessons
                          </p>
                        </div>
                      </div>
                      {expandedLectures[lecture._id] ? (
                        <FaChevronUp className="text-gray-400 text-sm flex-shrink-0" />
                      ) : (
                        <FaChevronDown className="text-gray-400 text-sm flex-shrink-0" />
                      )}
                    </button>

                    {expandedLectures[lecture._id] && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        {lecture.lessons
                          ?.sort((a, b) => a.order - b.order)
                          .map((lesson) => {
                            const isActive = lesson._id === lessonId;
                            return (
                              <button
                                key={lesson._id}
                                onClick={() => handleLessonClick(lesson._id)}
                                className={`w-full px-4 py-3 flex items-center justify-between border-b border-gray-200 last:border-0 transition-colors ${
                                  isActive
                                    ? "bg-primary/5 border-l-4 border-l-primary"
                                    : "hover:bg-white"
                                }`}
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {isActive ? (
                                    <FaPlayCircle className="text-primary flex-shrink-0 text-sm" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                                  )}
                                  <span
                                    className={`text-sm text-left truncate ${
                                      isActive
                                        ? "font-semibold text-primary"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {lesson.title}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                  {
                                    formatDuration(lesson.duration || 0)
                                      .formatted
                                  }
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonViewPage;
