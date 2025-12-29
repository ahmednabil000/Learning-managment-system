import { useParams, Link, useNavigate } from "react-router-dom";
import { useCourse } from "../../hooks/useCourses";
import { useTranslation } from "react-i18next";
import {
  FaChevronLeft,
  FaClock,
  FaBookOpen,
  FaUser,
  FaTag,
  FaChevronDown,
  FaChevronUp,
  FaPlayCircle,
  FaCalendarAlt,
  FaClipboardList,
} from "react-icons/fa";
import { useState } from "react";
import Button from "../../shared/components/Button";
import {
  formatDuration,
  formatDurationVerbose,
} from "../../utils/formatDuration";
import { useAssignmentsByCourse } from "../../hooks/useAssignments";

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const { data: course, isLoading, isError } = useCourse(courseId);
  const { data: assignments = [] } = useAssignmentsByCourse(courseId);
  const [expandedLectures, setExpandedLectures] = useState({});

  const toggleLecture = (lectureId) => {
    setExpandedLectures((prev) => ({
      ...prev,
      [lectureId]: !prev[lectureId],
    }));
  };

  const navigate = useNavigate();

  const handleEnroll = () => {
    navigate(`/checkout/${course._id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="heading-l text-error mb-4">Error loading course</h2>
        <Link to="/courses">
          <Button variant="primary">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  const totalLessons =
    course.lectures?.reduce(
      (acc, lecture) => acc + (lecture.lessons?.length || 0),
      0
    ) || 0;
  // Use the course duration from API (in seconds)
  const totalDuration = course.totalDuration || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary text-white py-12 md:py-20 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-primary-2/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 h-64 bg-accent/10 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            to="/courses"
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <FaChevronLeft
              className={`${isRtl ? "rotate-180" : ""} mr-2 rtl:ml-2 rtl:mr-0`}
            />
            Back to Courses
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              {course.tag && (
                <span className="inline-block bg-accent/20 backdrop-blur-md text-accent border border-accent/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                  {course.tag.name || course.tag}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {course.title}
              </h1>

              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden bg-white/10">
                    <img
                      src={
                        course.instructor?.imageUrl ||
                        "https://via.placeholder.com/100"
                      }
                      alt={course.instructor?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Instructor</p>
                    <p className="font-semibold">{course.instructor?.name}</p>
                  </div>
                </div>
                <div className="h-10 w-px bg-white/20 hidden md:block"></div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-white/60" />
                  <span>{formatDuration(totalDuration).formatted}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBookOpen className="text-white/60" />
                  <span>{totalLessons} Lessons</span>
                </div>
                <>
                  <div className="h-10 w-px bg-white/20 hidden md:block"></div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-white/60" />
                    <span>
                      {new Date(course.startingAt).toLocaleDateString()}
                    </span>
                  </div>
                </>
                {course.level && (
                  <>
                    <div className="h-10 w-px bg-white/20 hidden md:block"></div>
                    <div className="flex items-center gap-2">
                      {/* Using Tag icon or similar for level */}
                      <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-white/20">
                        {course.level}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Course Card Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-surface rounded-3xl shadow-2xl overflow-hidden text-text-main border border-border/50 sticky top-24">
                <div className="aspect-video relative overflow-hidden group">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white cursor-pointer hover:scale-110 transition-transform">
                      <FaPlayCircle size={32} />
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-4xl font-bold text-primary">
                      ${course.price}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full py-4 text-lg font-bold shadow-lg shadow-primary/20 mb-4"
                    onClick={handleEnroll}
                  >
                    Enroll Now
                  </Button>

                  <p className="text-center text-text-muted text-sm italic">
                    {"Last Updated"}:{" "}
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Curriculum */}
          <div className="lg:col-span-2">
            <h2 className="heading-l text-primary mb-8 flex items-center gap-3">
              <div className="w-2 h-8 bg-accent rounded-full"></div>
              Curriculum
            </h2>

            <div className="space-y-4">
              {course.lectures
                ?.sort((a, b) => a.order - b.order)
                .map((lecture) => (
                  <div
                    key={lecture._id}
                    className="bg-surface border border-border rounded-2xl overflow-hidden transition-all hover:border-primary/30"
                  >
                    <button
                      onClick={() => toggleLecture(lecture._id)}
                      className="w-full px-6 py-5 flex items-center justify-between hover:bg-background/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {lecture.order}
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-text-main">
                            {lecture.title}
                          </h3>
                          <p className="text-xs text-text-muted">
                            {lecture.lessons?.length || 0} lessons
                          </p>
                        </div>
                      </div>
                      {expandedLectures[lecture._id] ? (
                        <FaChevronUp className="text-text-muted" />
                      ) : (
                        <FaChevronDown className="text-text-muted" />
                      )}
                    </button>

                    {expandedLectures[lecture._id] && (
                      <div className="border-t border-border bg-background/30">
                        {/* Lessons */}
                        {lecture.lessons
                          ?.sort((a, b) => a.order - b.order)
                          .map((lesson) => (
                            <Link
                              key={lesson._id}
                              to={`/courses/${courseId}/lessons/${lesson._id}`}
                              className="px-6 py-4 flex items-center justify-between border-b border-border last:border-0 hover:bg-white transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <FaPlayCircle className="text-primary/40" />
                                <span className="text-sm font-medium text-text-main">
                                  {lesson.title}
                                </span>
                              </div>
                              <span className="text-xs text-text-muted font-mono">
                                {formatDuration(lesson.duration || 0).formatted}
                              </span>
                            </Link>
                          ))}

                        {/* Assignments */}
                        {assignments &&
                          assignments
                            .filter(
                              (a) =>
                                a.lecture === lecture._id ||
                                a.lectureId === lecture._id
                            ) // Handle both potential backend responses
                            .map((assignment) => (
                              <Link
                                key={assignment._id}
                                to={`/courses/${courseId}/assignments/${assignment._id}`}
                                className="px-6 py-4 flex items-center justify-between border-b border-border last:border-0 hover:bg-white transition-colors cursor-pointer bg-accent/5"
                              >
                                <div className="flex items-center gap-3">
                                  <FaClipboardList className="text-accent" />
                                  <span className="text-sm font-medium text-text-main">
                                    {assignment.title}
                                  </span>
                                </div>
                                <span className="text-xs text-text-muted font-mono bg-accent/10 px-2 py-1 rounded">
                                  Assignment
                                </span>
                              </Link>
                            ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Right Column / About Instructor / Other info */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-3xl p-8 mb-8 shadow-sm">
              <h3 className="heading-m text-primary mb-6">Instructor</h3>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-primary/10">
                  <img
                    src={course.instructor?.imageUrl}
                    alt={course.instructor?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold text-text-main mb-1">
                  {course.instructor?.name}
                </h4>
                <p className="text-secondary font-medium mb-4">
                  {course.instructor?.role}
                </p>
                {course.instructor?.bio && (
                  <p className="text-text-muted text-sm leading-relaxed">
                    {course.instructor.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
              <h3 className="heading-m text-primary mb-6">Course Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-2">
                    <FaUser size={14} /> Enrolled Students
                  </span>
                  <span className="font-bold">
                    {course.enrollmentCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-2">
                    <FaBookOpen size={14} /> Total Lectures
                  </span>
                  <span className="font-bold">
                    {course.lectures?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-2">
                    <FaClock size={14} /> Total Duration
                  </span>
                  <span className="font-bold">
                    {formatDurationVerbose(totalDuration)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-2">
                    <FaTag size={14} /> Category
                  </span>
                  <span className="font-bold text-primary">
                    {course.tag?.name || course.tag || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
