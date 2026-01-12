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
  FaLock,
} from "react-icons/fa";
import { useState } from "react";
import { formatDuration } from "../../utils/formatDuration";
import ReactPlayer from "react-player";
import CommentsSection from "./components/CommentsSection";
import CourseSidebar from "./components/CourseSidebar";

const LessonViewPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const {
    data: currentLesson,
    isLoading: lessonLoading,
    error: lessonError,
  } = useLesson(lessonId);

  // Find current lesson's lecture for auto-expand logic (optional, but keeping it simple)
  const currentLectureId = course?.lectures?.find((lecture) =>
    lecture.lessons?.some((lesson) => lesson._id === lessonId)
  )?._id;

  if (courseLoading || lessonLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (lessonError) {
    const status = lessonError.response?.status;

    if (status === 403) {
      return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
          <FaLock size={64} className="text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">
            You must be enrolled in this course to view this lesson.
          </p>
          <Link to={`/courses/${courseId}`}>
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
              Back to Course
            </button>
          </Link>
        </div>
      );
    }

    if (status === 401) {
      return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
          <FaLock size={64} className="text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
          <p className="text-gray-400 mb-6">
            Please log in to view this lesson.
          </p>
          <Link to="/login">
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
              Go to Login
            </button>
          </Link>
        </div>
      );
    }
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

  // Determine Video URL
  const videoSrc =
    currentLesson.url ||
    (currentLesson.videoUrl?.startsWith("http")
      ? currentLesson.videoUrl
      : null) ||
    (currentLesson.publicId
      ? `https://res.cloudinary.com/${
          import.meta.env.VITE_CLOUD_NAME || "Learning_Management_System"
        }/video/upload/${currentLesson.publicId}`
      : null);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] h-screen">
          {/* Left Column: Video + Info + Comments */}
          <div className="flex flex-col overflow-y-auto bg-gray-50">
            {/* Video Player */}
            <div className="w-full bg-black aspect-video shrink-0 relative group">
              {videoSrc ? (
                <ReactPlayer
                  src={videoSrc}
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
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                  <FaPlayCircle size={64} className="mb-4 opacity-40" />
                  <p className="text-lg">No video available for this lesson</p>
                  {/* Debug Info in production/dev for clarity if missing */}
                  <p className="text-xs mt-2 opacity-50 font-mono">
                    ID: {currentLesson._id} <br />
                    (Has URL: {currentLesson.url ? "Yes" : "No"}, Has PublicID:{" "}
                    {currentLesson.publicId ? "Yes" : "No"})
                  </p>
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
          <CourseSidebar course={course} currentItemId={lessonId} />
        </div>
      </div>
    </div>
  );
};

export default LessonViewPage;
