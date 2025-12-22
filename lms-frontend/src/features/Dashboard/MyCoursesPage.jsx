import { useState } from "react";
import { Link } from "react-router-dom";
import { useCourses, useDeleteCourse } from "../../hooks/useCourses";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Button from "../../shared/components/Button";
import notification from "../../utils/notification";

const MyCoursesPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageCount = 10;

  const { data, isLoading } = useCourses({ page, pageCount, search });
  const { mutate: deleteCourse } = useDeleteCourse();

  const courses = data?.shortCourses || [];
  const totalPages = data?.totalPages || 1;
  console.log(courses);
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      deleteCourse(id, {
        onSuccess: () => {
          notification.success("Course deleted successfully!");
        },
        onError: (error) => {
          notification.error(
            error?.response?.data?.message || "Failed to delete course."
          );
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="heading-l text-text-main">My Courses</h1>
          <p className="text-text-muted mt-1">
            Manage your courses and curriculum
          </p>
        </div>
        <Link to="/dashboard/courses/new">
          <Button variant="primary" className="flex items-center gap-2">
            <FaPlus /> Create New Course
          </Button>
        </Link>
      </div>

      <div className="bg-surface p-4 rounded-2xl border border-border flex items-center gap-3">
        <FaSearch className="text-text-muted" />
        <input
          type="text"
          placeholder="Search your courses..."
          className="bg-transparent border-none focus:ring-0 flex-1 text-text-main"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-border">
                <th className="px-6 py-4 font-bold text-text-main">Course</th>
                <th className="px-6 py-4 font-bold text-text-main text-center">
                  Price
                </th>
                <th className="px-6 py-4 font-bold text-text-main text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-border rounded w-48"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-border rounded w-12 mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 bg-border rounded w-24 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <tr
                    key={course._id}
                    className="hover:bg-background/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {course.imageUrl && (
                          <img
                            src={course.imageUrl}
                            alt={course.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-bold text-text-main">
                            {course.title}
                          </p>
                          <p className="text-xs text-text-muted truncate max-w-xs">
                            {course.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-primary">
                        ${course.price}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/dashboard/courses/${course._id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-info hover:bg-info/10"
                          >
                            <FaEdit />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-error hover:bg-error/10"
                          onClick={() => handleDelete(course._id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-12 text-center text-text-muted"
                  >
                    No courses found. Create your first course!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "primary" : "outline"}
              size="sm"
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
