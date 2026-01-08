import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronUp,
  FaPlayCircle,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { formatDuration } from "../../../utils/formatDuration";
import { useCourseBlogs } from "../../../hooks/useCourseBlogs"; // You'll need to export this or ensure it handles no-params

const CourseSidebar = ({ course, currentItemId }) => {
  const { courseId } = useParams();
  const [expandedLectures, setExpandedLectures] = useState({});

  // Fetch blogs
  const { data: allBlogs = [] } = useCourseBlogs(courseId, { limit: 1000 });

  // Helper to merge content
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

  const toggleLecture = (id) => {
    setExpandedLectures((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Auto-expand current lecture
  useEffect(() => {
    if (course && course.lectures) {
      for (const lecture of course.lectures) {
        const items = getLectureItems(lecture);
        if (items.some((item) => item._id === currentItemId)) {
          setExpandedLectures((prev) => ({ ...prev, [lecture._id]: true }));
          break;
        }
      }
    }
  }, [course, currentItemId, allBlogs]);

  if (!course) return null;

  const totalLessons = course.lectures?.reduce(
    (acc, lecture) => acc + (lecture.lessons?.length || 0),
    0
  );

  // Total blogs?
  const totalBlogs = allBlogs.length; // Approximate, or filter by course lectures

  return (
    <div className="bg-white border-l border-gray-200 overflow-y-auto h-full">
      <div className="p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
        <h3 className="text-lg font-bold text-gray-900">Course Content</h3>
        <p className="text-sm text-gray-600 mt-1">
          {totalLessons} lessons • {totalBlogs} blogs
        </p>
      </div>

      <div className="p-3 space-y-2">
        {course.lectures
          ?.sort((a, b) => a.order - b.order)
          .map((lecture) => {
            const items = getLectureItems(lecture);
            return (
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
                        {items.length} items
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
                    {items.map((item) => {
                      const isActive = item._id === currentItemId;
                      const linkTo =
                        item.type === "lesson"
                          ? `/courses/${courseId}/lessons/${item._id}`
                          : `/courses/${courseId}/blogs/${item._id}`;

                      return (
                        <Link
                          key={item._id}
                          to={linkTo}
                          className={`w-full px-4 py-3 flex items-center justify-between border-b border-gray-200 last:border-0 transition-colors ${
                            isActive
                              ? "bg-primary/5 border-l-4 border-l-primary"
                              : "hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {isActive ? (
                              item.type === "lesson" ? (
                                <FaPlayCircle className="text-primary flex-shrink-0 text-sm" />
                              ) : (
                                <FaFileAlt className="text-primary flex-shrink-0 text-sm" />
                              )
                            ) : item.type === "lesson" ? (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                            ) : (
                              <FaFileAlt className="text-gray-400 flex-shrink-0 text-sm" />
                            )}
                            <span
                              className={`text-sm text-left truncate ${
                                isActive
                                  ? "font-semibold text-primary"
                                  : "text-gray-700"
                              }`}
                            >
                              {item.title}
                            </span>
                          </div>
                          {item.type === "lesson" && (
                            <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                              {formatDuration(item.duration || 0).formatted}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CourseSidebar;
