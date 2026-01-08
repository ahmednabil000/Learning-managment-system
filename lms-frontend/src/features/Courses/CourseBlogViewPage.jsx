import { useParams, Link } from "react-router-dom";
import { useCourse } from "../../hooks/useCourses";
import { useBlog } from "../../hooks/useCourseBlogs";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaCalendar, FaUser, FaLock } from "react-icons/fa";
import CourseSidebar from "./components/CourseSidebar";

const CourseBlogViewPage = () => {
  const { courseId, blogId } = useParams();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const {
    data: blog,
    isLoading: blogLoading,
    error: blogError,
  } = useBlog(blogId);

  if (courseLoading || blogLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (blogError) {
    if (
      blogError.response?.status === 401 ||
      blogError.response?.status === 403
    ) {
      return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
          <FaLock size={64} className="text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">
            You must be enrolled to view this blog.
          </p>
          <Link to={`/courses/${courseId}`}>
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
              Back to Course
            </button>
          </Link>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl text-white">Error loading blog</h2>
        <Link to={`/courses/${courseId}`}>
          <button className="mt-4 px-6 py-3 bg-primary text-white rounded-lg">
            Back to Course
          </button>
        </Link>
      </div>
    );
  }

  if (!course || !blog) return null;

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
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] h-[calc(100vh-73px)]">
          {/* Left Column: Blog Content */}
          <div className="flex flex-col overflow-y-auto bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto w-full bg-white rounded-xl shadow-sm p-8 min-h-[500px]">
              {blog.thumbnail && (
                <div className="mb-6 rounded-lg overflow-hidden h-64 md:h-80 w-full relative">
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {blog.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-4 border-b border-gray-100">
                <span className="flex items-center gap-1">
                  <FaCalendar /> {new Date(blog.createdAt).toLocaleDateString()}
                </span>
                {blog.user && (
                  <span className="flex items-center gap-1">
                    <FaUser /> {blog.user.name}
                  </span>
                )}
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <CourseSidebar course={course} currentItemId={blogId} />
        </div>
      </div>
    </div>
  );
};

export default CourseBlogViewPage;
