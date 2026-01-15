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
  FaCheck,
  FaVideo,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import Button from "../../shared/components/Button";
import {
  formatDuration,
  formatDurationVerbose,
} from "../../utils/formatDuration";
import { useAssignmentsByCourse } from "../../hooks/useAssignments";
import { useCourseBlogs } from "../../hooks/useCourseBlogs";
import { useCourseAvailableExam } from "../../hooks/useExams";
import { useSessions } from "../../hooks/useLiveSessions";
import CourseCommentsSection from "./components/CourseCommentsSection";
import VideoModal from "../../shared/components/VideoModal";
import LiveSessionBanner from "./components/LiveSessionBanner";

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const { data: course, isLoading, isError } = useCourse(courseId);
  const { data: assignments = [] } = useAssignmentsByCourse(courseId);
  const { data: allBlogs = [] } = useCourseBlogs(courseId, { limit: 1000 });
  const { data: sessions = [] } = useSessions({ courseId });
  // Exam Logic
  const { data: examData } = useCourseAvailableExam(courseId);
  const [examState, setExamState] = useState({ status: null, countdown: null });

  useEffect(() => {
    if (!examData) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const start = new Date(examData.startDate).getTime();
      const end = start + examData.duration * 60 * 1000;

      let status = "upcoming";
      let target = start;

      if (now >= start && now < end) {
        status = "live";
        target = end;
      } else if (now >= end) {
        status = "ended";
      }

      setExamState({ status, countdown: Math.max(0, target - now) });
    }, 1000);
    return () => clearInterval(interval);
  }, [examData]);

  const formatCountdown = (ms) => {
    if (ms == null || ms < 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const [expandedLectures, setExpandedLectures] = useState({});

  const toggleLecture = (lectureId) => {
    setExpandedLectures((prev) => ({
      ...prev,
      [lectureId]: !prev[lectureId],
    }));
  };

  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const handlePreview = () => {
    const sortedLectures =
      course.lectures?.sort((a, b) => a.order - b.order) || [];
    const firstLectureWithLessons = sortedLectures.find(
      (l) => l.lessons && l.lessons.length > 0
    );

    if (firstLectureWithLessons) {
      const sortedLessons = firstLectureWithLessons.lessons.sort(
        (a, b) => a.order - b.order
      );
      setPreviewUrl(sortedLessons[0].videoUrl);
      setShowPreview(true);
    } else {
      // Fallback or notification if no video found
    }
  };

  const getLectureItems = (lecture) => {
    const lessons = (lecture.lessons || []).map((l) => ({
      ...l,
      type: "lesson",
    }));
    const blogs = (allBlogs || [])
      .filter(
        (b) => b.lecture === lecture._id || b.lecture?._id === lecture._id
      )
      .map((b) => ({ ...b, type: "blog" }));
    return [...lessons, ...blogs].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
  };

  const navigate = useNavigate();

  const handleEnroll = () => {
    if (course.isEnroll) {
      const sortedLectures =
        course.lectures?.sort((a, b) => a.order - b.order) || [];
      const firstLectureWithLessons = sortedLectures.find(
        (l) => l.lessons && l.lessons.length > 0
      );

      if (firstLectureWithLessons) {
        const sortedLessons = firstLectureWithLessons.lessons.sort(
          (a, b) => a.order - b.order
        );
        navigate(`/courses/${courseId}/lessons/${sortedLessons[0]._id}`);
      } else {
        const el = document.getElementById("curriculum-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`/checkout/${course._id}`);
    }
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

  const totalDuration =
    course.lectures?.reduce(
      (acc, lecture) =>
        acc +
        (lecture.lessons?.reduce((lAcc, lesson) => lAcc + lesson.duration, 0) ||
          0),
      0
    ) || 0;

  const totalLessons =
    course.lectures?.reduce(
      (acc, lecture) => acc + (lecture.lessons?.length || 0),
      0
    ) || 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="bg-primary text-white relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-3">
              <Link
                to="/courses"
                className="inline-flex items-center text-white/70 hover:text-white transition-colors text-xs font-medium mb-0.5"
              >
                <FaChevronLeft
                  className={`${
                    isRtl ? "rotate-180" : ""
                  } mr-1 rtl:ml-1 rtl:mr-0`}
                />
                Back to Courses
              </Link>
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">
                {course.title}
              </h1>
              <p className="text-sm lg:text-base text-white/90 leading-relaxed max-w-2xl">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs font-medium">
                <Link
                  to={`/instructors/${course.instructor?._id}`}
                  className="flex items-center gap-2 hover:bg-white/10 py-1 px-2 -ml-2 rounded-lg transition-colors group"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-white/30 group-hover:border-white">
                    <img
                      src={
                        course.instructor?.imageUrl ||
                        "https://placehold.co/40x40"
                      }
                      alt={course.instructor?.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-white/90 group-hover:text-white">
                    {course.instructor?.name}
                  </span>
                </Link>

                <div className="h-3 w-px bg-white/20 hidden md:block"></div>

                <div className="flex items-center gap-1.5 text-white/80">
                  <FaClock size={12} />
                  <span>{formatDuration(totalDuration).formatted}</span>
                </div>

                <div className="flex items-center gap-1.5 text-white/80">
                  <FaBookOpen size={12} />
                  <span>{totalLessons} Lessons</span>
                </div>

                <div className="h-3 w-px bg-white/20 hidden md:block"></div>

                <div className="flex items-center gap-1.5 text-white/80">
                  <FaCalendarAlt size={12} />
                  <span>
                    {course.createdAt
                      ? new Date(course.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                {course.level && (
                  <>
                    <div className="h-3 w-px bg-white/20 hidden md:block"></div>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border border-white/10 text-white/90">
                      {course.level}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Course Card Sticky Sidebar */}
            <div className="lg:col-span-1 flex justify-center lg:justify-end">
              <div className="bg-surface rounded-xl shadow-xl overflow-hidden text-text-main border border-border/50 sticky top-24 w-full max-w-sm">
                <div className="aspect-video relative overflow-hidden group">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center cursor-pointer"
                    onClick={handlePreview}
                  >
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white cursor-pointer hover:scale-110 transition-transform">
                      <FaPlayCircle size={24} />
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex flex-col items-start mb-4">
                    {course.isSale ||
                    (course.discount > 0 && course.salePrice) ? (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold text-primary">
                            ${course.salePrice}
                          </span>
                          <span className="bg-error/10 text-error text-xs font-bold px-2 py-0.5 rounded border border-error/20">
                            {course.discount}% OFF
                          </span>
                        </div>
                        <span className="text-sm text-text-muted line-through mt-0.5">
                          ${course.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold text-primary">
                        ${course.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    className="w-full py-3 text-base font-bold shadow-lg shadow-primary/20 mb-3"
                    onClick={handleEnroll}
                  >
                    {course.isEnroll ? t("courses.go_to_course") : "Enroll Now"}
                  </Button>

                  <p className="text-center text-text-muted text-xs italic">
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
        {/* Live Session Notification */}
        {sessions && sessions.length > 0 && (
          <LiveSessionBanner
            session={sessions.find(
              (s) =>
                (s.courseId === courseId ||
                  s.course === courseId ||
                  s.course?._id === courseId) &&
                (s.status === "live" || s.status === "scheduled")
            )}
          />
        )}

        {/* Exam Notification */}
        {examData && examState.status && examState.status !== "ended" && (
          <div
            className={`mb-8 p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm ${
              examState.status === "live"
                ? "bg-error/5 border-error/30"
                : "bg-primary/5 border-primary/20"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-full ${
                  examState.status === "live"
                    ? "bg-error/10 text-error"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <FaClipboardList size={24} />
              </div>
              <div>
                <h3
                  className={`text-xl font-bold ${
                    examState.status === "live" ? "text-error" : "text-primary"
                  }`}
                >
                  {examState.status === "live"
                    ? "Live Exam In Progress!"
                    : "Upcoming Exam"}
                </h3>
                <p className="text-text-main font-bold mt-1 text-lg">
                  {examData.title}
                </p>
                <p className="text-sm text-text-muted max-w-xl">
                  {examData.description}
                </p>
              </div>
            </div>
            <div className="text-right flex flex-col items-center md:items-end min-w-[200px]">
              <p className="text-xs text-text-muted uppercase tracking-wider font-bold mb-1">
                {examState.status === "live" ? "Time Remaining" : "Starts In"}
              </p>
              <p className="text-3xl font-mono font-black text-text-main tracking-tight">
                {formatCountdown(examState.countdown)}
              </p>
              {examState.status === "live" && (
                <Link to={`/courses/${courseId}/exams/${examData._id}`}>
                  <Button
                    variant="primary"
                    className="mt-3 bg-error hover:bg-error/90 border-error w-full shadow-lg shadow-error/20"
                    size="lg"
                  >
                    Take Exam Now
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Curriculum */}
          <div className="lg:col-span-2">
            {/* What You Will Learn */}
            {course.learning && course.learning.length > 0 && (
              <div className="bg-surface border border-border rounded-3xl p-8 mb-8 shadow-sm">
                <h2 className="heading-l text-primary mb-6">
                  What you'll learn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.learning.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <FaCheck className="text-success mt-1 shrink-0" />
                      <span className="text-text-main leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h2
              id="curriculum-section"
              className="heading-l text-primary mb-8 flex items-center gap-3"
            >
              <div className="w-2 h-8 bg-accent rounded-full"></div>
              Curriculum
            </h2>

            <div className="space-y-4 mb-8">
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
                            {getLectureItems(lecture).length} items
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
                        {/* Mixed Items */}
                        {getLectureItems(lecture).map((item) =>
                          item.type === "lesson" ? (
                            <Link
                              key={item._id}
                              to={`/courses/${courseId}/lessons/${item._id}`}
                              className="px-6 py-4 flex items-center justify-between border-b border-border last:border-0 hover:bg-white transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <FaPlayCircle className="text-primary/40" />
                                <span className="text-sm font-medium text-text-main">
                                  {item.title}
                                </span>
                              </div>
                              <span className="text-xs text-text-muted font-mono">
                                {formatDuration(item.duration || 0).formatted}
                              </span>
                            </Link>
                          ) : (
                            <Link
                              key={item._id}
                              to={`/courses/${courseId}/blogs/${item._id}`}
                              className="px-6 py-4 flex items-center justify-between border-b border-border last:border-0 hover:bg-white transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className="text-primary/40">
                                  <FaBookOpen />
                                </div>
                                <span className="text-sm font-medium text-text-main">
                                  {item.title}
                                </span>
                              </div>
                              <span className="text-xs text-text-muted font-mono">
                                Blog
                              </span>
                            </Link>
                          )
                        )}

                        {/* Assignments */}
                        {assignments &&
                          assignments
                            .filter(
                              (a) =>
                                a.lecture === lecture._id ||
                                a.lectureId === lecture._id
                            )
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

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <div className="bg-surface border border-border rounded-3xl p-8 mb-8 shadow-sm">
                <h2 className="heading-l text-primary mb-6">Requirements</h2>
                <ul className="space-y-3">
                  {course.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-text-muted mt-2 shrink-0"></div>
                      <span className="text-text-main leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column / About Instructor / Other info */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-3xl p-8 mb-8 shadow-sm">
              <h3 className="heading-m text-primary mb-6">Instructor</h3>
              <div className="flex flex-col items-center text-center">
                <Link
                  to={`/instructors/${course.instructor?._id}`}
                  className="group cursor-pointer flex flex-col items-center"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-primary/10 group-hover:border-primary transition-colors">
                    <img
                      src={
                        course.instructor?.imageUrl ||
                        "https://placehold.co/150x150"
                      }
                      alt={course.instructor?.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="text-xl font-bold text-text-main mb-1 group-hover:text-primary transition-colors">
                    {course.instructor?.name}
                  </h4>
                </Link>
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

        {/* Course Comments Section */}
        <CourseCommentsSection courseId={courseId} />

        {/* Video Preview Modal */}
        <VideoModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          videoUrl={previewUrl}
        />
      </div>
    </div>
  );
};

export default CourseDetailsPage;
