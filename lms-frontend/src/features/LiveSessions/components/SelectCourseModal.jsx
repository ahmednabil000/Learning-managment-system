import { useState } from "react";
import { useCourses } from "../../../hooks/useCourses";
import { FaSearch, FaTimes } from "react-icons/fa";
import Button from "../../../shared/components/Button";

const SelectCourseModal = ({ isOpen, onClose, onSelectCourse }) => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useCourses({ search, pageCount: 50 });
  const courses = data?.shortCourses || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-2xl rounded-2xl border border-border overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-main">Select Course</h2>
            <p className="text-text-muted mt-1">
              Choose a course to create a live session for
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-full transition-colors text-text-muted"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search your courses..."
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
              </div>
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <div
                  key={course._id}
                  onClick={() => onSelectCourse(course)}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all group"
                >
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-background flex items-center justify-center text-text-muted text-2xl">
                      📚
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-text-main group-hover:text-primary transition-colors truncate">
                      {course.title}
                    </h4>
                    <p className="text-sm text-text-muted line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Select
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-text-muted">
                No courses found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCourseModal;
