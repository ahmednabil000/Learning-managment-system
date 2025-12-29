import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaClipboardList,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
  FaBookOpen,
} from "react-icons/fa";
import Button from "../../shared/components/Button";
import { useInstructorCourses } from "../../hooks/useCourses";
import {
  useAssignmentsByCourse,
  useDeleteAssignment,
} from "../../hooks/useAssignments";
import ConfirmModal from "../../shared/components/ConfirmModal";
import notification from "../../utils/notification";

const InstructorAssignmentsPage = () => {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    assignment: null,
  });

  // 1. Fetch Instructor Courses to populate dropdown
  const { data: courses = [], isLoading: isLoadingCourses } =
    useInstructorCourses();

  // 2. Fetch Assignments for selected course
  // Note: We only fetch if a course is selected.
  const { data: assignments = [], isLoading: isLoadingAssignments } =
    useAssignmentsByCourse(selectedCourseId);

  const { mutate: deleteAssignment, isPending: isDeleting } =
    useDeleteAssignment({
      onSuccess: () => {
        notification.success("Assignment deleted successfully");
        setDeleteModal({ isOpen: false, assignment: null });
      },
      onError: () => notification.error("Failed to delete assignment"),
    });

  // Auto-select first course if available and none selected
  if (!selectedCourseId && courses.length > 0) {
    setSelectedCourseId(courses[0]._id);
  }

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (assignment) => {
    setDeleteModal({ isOpen: true, assignment });
  };

  const confirmDelete = () => {
    if (deleteModal.assignment) {
      deleteAssignment(deleteModal.assignment._id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="heading-l text-text-main">Assignments Management</h1>
          <p className="text-text-muted mt-1">
            View and manage assignments for your courses.
          </p>
        </div>
        <div className="flex gap-2">
          {/* Direct link to course edit for creating assignments (context-aware) */}
          {selectedCourseId && (
            <Link to={`/dashboard/courses/${selectedCourseId}/edit`}>
              <Button variant="primary" className="flex items-center gap-2">
                <FaPlus /> Manage in Course
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Course Selection and Search */}
      <div className="bg-surface p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full md:w-auto">
          <label className="block text-xs font-bold text-text-muted uppercase mb-1">
            Select Course
          </label>
          <select
            className="w-full p-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={isLoadingCourses}
          >
            {isLoadingCourses && <option>Loading courses...</option>}
            {!isLoadingCourses && courses.length === 0 && (
              <option>No courses found</option>
            )}
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 w-full md:w-auto relative">
          <label className="block text-xs font-bold text-text-muted uppercase mb-1">
            Search Assignments
          </label>
          <FaSearch className="absolute left-3 top-[34px] text-text-muted" />
          <input
            type="text"
            placeholder="Search by title..."
            className="w-full pl-9 p-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Assignments List */}
      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        {!selectedCourseId ? (
          <div className="p-10 text-center text-text-muted">
            Please select a course to view assignments.
          </div>
        ) : isLoadingAssignments ? (
          <div className="p-10 flex justifying-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center text-text-muted mb-4 text-2xl">
              <FaClipboardList />
            </div>
            <h3 className="text-lg font-bold text-text-main mb-2">
              No Assignments Found
            </h3>
            <p className="text-text-muted max-w-md mx-auto mb-6">
              There are no assignments for this course matching your search. Go
              to the course curriculum to add new assignments to lectures.
            </p>
            <Link to={`/dashboard/courses/${selectedCourseId}/edit`}>
              <Button variant="outline">Go to Curriculum</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/50 border-b border-border text-xs uppercase text-text-muted">
                  <th className="p-4 rounded-tl-xl">Title</th>
                  <th className="p-4">Max Score</th>
                  <th className="p-4">Questions</th>
                  <th className="p-4 text-right rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAssignments.map((assignment) => (
                  <tr
                    key={assignment._id}
                    className="hover:bg-background/50 transition-colors group"
                  >
                    <td className="p-4 font-medium text-text-main flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                        <FaClipboardList />
                      </div>
                      <div>{assignment.title}</div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-text-main">
                      {assignment.maxScore} pts
                    </td>
                    <td className="p-4 text-sm text-text-muted">
                      {assignment.questions
                        ? assignment.questions.length
                        : "N/A"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Link to view as student (preview) */}
                        <Link
                          to={`/courses/${selectedCourseId}/assignments/${assignment._id}`}
                          target="_blank"
                        >
                          <Button variant="ghost" size="sm" title="Preview">
                            <FaExternalLinkAlt
                              className="text-text-muted"
                              size={14}
                            />
                          </Button>
                        </Link>

                        {/* Edit Link -> Goes to Course Edit, ideally focusing the assignment, but general link for now */}
                        <Link
                          to={`/dashboard/courses/${selectedCourseId}/edit`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Edit in Curriculum"
                          >
                            <FaEdit className="text-info" size={16} />
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(assignment)}
                          title="Delete"
                        >
                          <FaTrash className="text-error" size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Assignment"
        message={`Are you sure you want to delete "${deleteModal.assignment?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, assignment: null })}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default InstructorAssignmentsPage;
