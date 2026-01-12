import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaVideo,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaClipboardList,
  FaQuestionCircle,
} from "react-icons/fa";
import Button from "../../../shared/components/Button";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import {
  useCreateLecture,
  useUpdateLecture,
  useDeleteLecture,
  useLecturesByCourse,
} from "../../../hooks/useLectures";
import {
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
  useLessonsByLecture,
} from "../../../hooks/useLessons";
import {
  useAssignmentsByCourse,
  useCreateAssignment,
  useUpdateAssignment,
  useDeleteAssignment,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  useAssignmentsByLecture,
  useQuestionsByAssignment,
} from "../../../hooks/useAssignments";
import CloudinaryService from "../../../services/CloudinaryService";
import notification from "../../../utils/notification";
import LectureForm from "./LectureForm";
import LessonForm from "./LessonForm";
import AssignmentForm from "./AssignmentForm";
import QuestionForm from "./QuestionForm";
import {
  useCourseBlogs,
  useCreateBlog,
  useUpdateBlog,
  useDeleteBlog,
} from "../../../hooks/useCourseBlogs";
import {
  useExamsByCourse,
  useCreateExam,
  useDeleteExam as useDeleteExamHook,
  useAddQuestion,
  useRemoveQuestion,
} from "../../../hooks/useExams";
import ExamForm from "./ExamForm";
import ExamQuestionForm from "./ExamQuestionForm"; // Still used? Maybe not if moved to Card
import ExamCard from "./ExamCard";
import LectureItemService from "../../../services/LectureItemService";
import LessonsService from "../../../services/LessonsService";
import { FaFileAlt, FaArrowUp, FaArrowDown } from "react-icons/fa";

const CurriculumManager = ({ courseId }) => {
  const [expandedLectures, setExpandedLectures] = useState({});
  const [isAddingLecture, setIsAddingLecture] = useState(false);
  const [editingLectureId, setEditingLectureId] = useState(null);
  const [addingLessonToLectureId, setAddingLessonToLectureId] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);

  // Assignment States
  const [addingAssignmentToLectureId, setAddingAssignmentToLectureId] =
    useState(null);
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);

  // Exam States
  const [isAddingExam, setIsAddingExam] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  // Deletion Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    isLoading: false,
  });

  const { data: lectures = [], isLoading: isLoadingLectures } =
    useLecturesByCourse(courseId);

  // Fetch all assignments for the course
  const { data: courseAssignments = [] } = useAssignmentsByCourse(courseId);

  const { mutate: createLecture, isPending: isCreatingLecture } =
    useCreateLecture({
      onSuccess: () => {
        notification.success("Lecture created successfully!");
        setIsAddingLecture(false);
      },
      onError: (err) =>
        notification.error(
          err?.response?.data?.message || "Failed to create lecture"
        ),
    });

  const { mutate: updateLecture, isPending: isUpdatingLecture } =
    useUpdateLecture({
      onSuccess: () => {
        notification.success("Lecture updated successfully!");
        setEditingLectureId(null);
      },
      onError: (err) =>
        notification.error(
          err?.response?.data?.message || "Failed to update lecture"
        ),
    });

  const { mutate: deleteLecture, isPending: isDeletingLecture } =
    useDeleteLecture(courseId, {
      onSuccess: () => {
        notification.success("Lecture and its lessons deleted!");
        closeDeleteModal();
      },
      onError: (err) => {
        notification.error(
          err?.response?.data?.message || "Failed to delete lecture"
        );
        closeDeleteModal();
      },
    });

  const { mutate: createLesson, isPending: isCreatingLesson } = useCreateLesson(
    {
      onSuccess: () => {
        notification.success("Lesson created successfully!");
        setAddingLessonToLectureId(null);
      },
      onError: (err) =>
        notification.error(
          err?.response?.data?.message || "Failed to create lesson"
        ),
    }
  );

  const { mutate: updateLesson, isPending: isUpdatingLesson } = useUpdateLesson(
    {
      onSuccess: () => {
        notification.success("Lesson updated successfully!");
        setEditingLessonId(null);
      },
      onError: (err) =>
        notification.error(
          err?.response?.data?.message || "Failed to update lesson"
        ),
    }
  );

  const { mutate: deleteLesson, isPending: isDeletingLesson } = useDeleteLesson(
    null,
    {
      onSuccess: () => {
        notification.success("Lesson deleted successfully!");
        closeDeleteModal();
      },
      onError: (err) => {
        notification.error(
          err?.response?.data?.message || "Failed to delete lesson"
        );
        closeDeleteModal();
      },
    }
  );

  // --- Assignment Mutations ---
  const { mutate: createAssignment, isPending: isCreatingAssignment } =
    useCreateAssignment({
      onSuccess: () => {
        notification.success("Assignment created successfully!");
        setAddingAssignmentToLectureId(null);
      },
      onError: (err) =>
        notification.error(
          err?.response?.data?.message || "Failed to create assignment"
        ),
    });

  const { mutate: updateAssignment, isPending: isUpdatingAssignment } =
    useUpdateAssignment({
      onSuccess: () => {
        notification.success("Assignment updated!");
        setEditingAssignmentId(null);
      },
      onError: (err) =>
        notification.error(
          err?.response?.data?.message || "Failed to update assignment"
        ),
    });

  const { mutate: deleteAssignment, isPending: isDeletingAssignment } =
    useDeleteAssignment({
      onSuccess: () => {
        notification.success("Assignment deleted!");
        closeDeleteModal();
      },
      onError: (err) => {
        notification.error(
          err?.response?.data?.message || "Failed to delete assignment"
        );
        closeDeleteModal();
      },
    });

  // --- Exam Query & Mutations ---
  const { data: exams = [] } = useExamsByCourse(courseId);

  const { mutate: createExam, isPending: isCreatingExam } = useCreateExam({
    onSuccess: () => {
      notification.success("Exam created!");
      setIsAddingExam(false);
      // Invalidate query handled in hook? The hook invalidates "available-exam".
      // We need to invalidate "exams-by-course" too.
      // Ideally update the hook useCreateExam.
    },
    onError: (err) =>
      notification.error(err?.response?.data?.message || "Error creating exam"),
  });

  const { mutate: deleteExamCmd, isPending: isDeletingExam } =
    useDeleteExamHook(courseId, {
      onSuccess: () => {
        notification.success("Exam deleted");
        closeDeleteModal();
      },
      onError: (err) => {
        notification.error(
          err?.response?.data?.message || "Failed to delete exam"
        );
        closeDeleteModal();
      },
    });

  /* We have loading state for adding question but it is global. 
     If multiple exams, all cards show loading. That's acceptable for now or can use query key tracking. 
  */
  const { mutate: addQuestion, isPending: isAddingQ } = useAddQuestion({
    onSuccess: () => {
      // notification.success("Question added"); // Handled in component potentially or here
      // setIsAddingQuestion(false); // No longer global
    },
    onError: (err) =>
      notification.error(
        err?.response?.data?.message || "Failed to add question"
      ),
  });

  const { mutate: removeQuestion } = useRemoveQuestion({
    onSuccess: () => notification.success("Question removed"),
    onError: (err) =>
      notification.error(
        err?.response?.data?.message || "Failed to remove question"
      ),
  });

  const closeDeleteModal = () => {
    setDeleteModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
  };

  const toggleLecture = (id) => {
    setExpandedLectures((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddLectureSubmit = (data) => {
    createLecture({
      ...data,
      courseId,
      order: lectures.length + 1,
    });
  };

  const handleEditLectureSubmit = (data, lectureId) => {
    updateLecture({ id: lectureId, data: { ...data, courseId } });
  };

  const handleDeleteLecture = (lecture) => {
    setDeleteModal({
      isOpen: true,
      title: "Delete Lecture",
      message: `Are you sure you want to delete "${lecture.title}"? This will also remove all lessons within this lecture. This action cannot be undone.`,
      onConfirm: () => {
        setDeleteModal((prev) => ({ ...prev, isLoading: true }));
        deleteLecture(lecture._id);
      },
      isLoading: false,
    });
  };

  const handleDeleteLesson = (lesson) => {
    setDeleteModal({
      isOpen: true,
      title: "Delete Lesson",
      message: `Are you sure you want to delete lesson "${lesson.title}"? This action cannot be undone.`,
      onConfirm: () => {
        setDeleteModal((prev) => ({ ...prev, isLoading: true }));
        deleteLesson(lesson._id);
      },
      isLoading: false,
    });
  };

  const handleAddLessonSubmit = (data, lectureId, lessonCount) => {
    createLesson({
      ...data,
      lectureId,
      course: courseId,
      order: lessonCount + 1,
    });
  };

  const handleEditLessonSubmit = (data, lesson) => {
    updateLesson({
      id: lesson._id,
      data: { ...lesson, ...data, course: courseId },
    });
  };

  // --- Assignment Handlers ---

  const handleAddAssignmentSubmit = (data, lectureId) => {
    createAssignment({
      ...data,
      lecture: lectureId,
    });
  };

  const handleDeleteAssignment = (assignment) => {
    setDeleteModal({
      isOpen: true,
      title: "Delete Assignment",
      message: `Are you sure you want to delete assignment "${assignment.title}"?`,
      onConfirm: () => {
        setDeleteModal((prev) => ({ ...prev, isLoading: true }));
        deleteAssignment(assignment._id);
      },
      isLoading: false,
    });
  };

  // --- Exam Handlers ---
  const handleCreateExamSubmit = (data) => {
    // Ensure startDate is ISO
    let startDate = data.startDate;
    if (startDate && !startDate.endsWith("Z")) {
      startDate = new Date(startDate).toISOString();
    }
    createExam({ ...data, startDate, course: courseId });
  };

  /* Updated HandleDeleteExamClick to accept exam param */
  const handleDeleteExamClick = (examToDelete) => {
    setDeleteModal({
      isOpen: true,
      title: "Delete Exam",
      message: "Are you sure you want to delete this exam?",
      onConfirm: () => {
        setDeleteModal((prev) => ({ ...prev, isLoading: true }));
        deleteExamCmd(examToDelete._id);
      },
      isLoading: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-text-main">Curriculum</h3>
        {!isAddingLecture && (
          <Button
            onClick={() => setIsAddingLecture(true)}
            variant="primary"
            size="sm"
            className="flex items-center gap-2"
          >
            <FaPlus /> Add Lecture
          </Button>
        )}
      </div>

      {isAddingLecture && (
        <LectureForm
          onSubmit={handleAddLectureSubmit}
          onCancel={() => setIsAddingLecture(false)}
          isLoading={isCreatingLecture}
        />
      )}

      {isLoadingLectures ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-surface border border-border rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      ) : lectures.length === 0 && !isAddingLecture ? (
        <div className="text-center py-10 bg-background/50 border-2 border-dashed border-border rounded-xl">
          <p className="text-text-muted">
            No lectures added yet. Start by adding a lecture.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {[...lectures]
            .sort((a, b) => a.order - b.order)
            .map((lecture) => (
              <div
                key={lecture._id}
                className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm"
              >
                {editingLectureId === lecture._id ? (
                  <div className="p-4">
                    <LectureForm
                      initialData={{
                        title: lecture.title,
                        description: lecture.description,
                      }}
                      onSubmit={(data) =>
                        handleEditLectureSubmit(data, lecture._id)
                      }
                      onCancel={() => setEditingLectureId(null)}
                      isLoading={isUpdatingLecture}
                    />
                  </div>
                ) : (
                  <div className="p-4 flex items-center justify-between bg-background/20">
                    <div
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => toggleLecture(lecture._id)}
                    >
                      {expandedLectures[lecture._id] ? (
                        <FaChevronUp className="text-text-muted group-hover:text-primary transition-colors" />
                      ) : (
                        <FaChevronDown className="text-text-muted group-hover:text-primary transition-colors" />
                      )}
                      <span className="font-bold text-text-main group-hover:text-primary transition-colors">
                        Lecture {lecture.order}: {lecture.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingLectureId(lecture._id)}
                      >
                        <FaEdit className="text-info" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLecture(lecture)}
                      >
                        <FaTrash className="text-error" />
                      </Button>
                    </div>
                  </div>
                )}

                {expandedLectures[lecture._id] &&
                  editingLectureId !== lecture._id && (
                    <LectureContent
                      courseId={courseId}
                      lectureId={lecture._id}
                      updateLesson={updateLesson}
                      deleteLesson={handleDeleteLesson}
                      addingLessonToLectureId={addingLessonToLectureId}
                      setAddingLessonToLectureId={setAddingLessonToLectureId}
                      handleAddLessonSubmit={handleAddLessonSubmit}
                      isCreatingLesson={isCreatingLesson}
                      editingLessonId={editingLessonId}
                      setEditingLessonId={setEditingLessonId}
                      handleEditLessonSubmit={handleEditLessonSubmit}
                      isUpdatingLesson={isUpdatingLesson}
                      // Assignment Props
                      assignments={courseAssignments.filter(
                        (a) =>
                          a.lecture === lecture._id ||
                          a.lectureId === lecture._id
                      )}
                      addingAssignmentToLectureId={addingAssignmentToLectureId}
                      setAddingAssignmentToLectureId={
                        setAddingAssignmentToLectureId
                      }
                      handleAddAssignmentSubmit={handleAddAssignmentSubmit}
                      isCreatingAssignment={isCreatingAssignment}
                      editingAssignmentId={editingAssignmentId}
                      setEditingAssignmentId={setEditingAssignmentId}
                      updateAssignment={updateAssignment}
                      isUpdatingAssignment={isUpdatingAssignment}
                      deleteAssignment={handleDeleteAssignment}
                    />
                  )}
              </div>
            ))}
        </div>
      )}

      {/* Exam Section */}
      <div className="pt-6 border-t border-border mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-text-main">Exams</h3>
          {!isAddingExam && (
            <Button
              onClick={() => setIsAddingExam(true)}
              variant="primary"
              size="sm"
              className="flex items-center gap-2"
            >
              <FaPlus /> Create Exam
            </Button>
          )}
        </div>

        {isAddingExam && (
          <ExamForm
            onSubmit={handleCreateExamSubmit}
            onCancel={() => setIsAddingExam(false)}
            isLoading={isCreatingExam}
          />
        )}

        {exams.length > 0 ? (
          <div className="space-y-6">
            {exams.map((exam) => (
              <ExamCard
                key={exam._id}
                exam={exam}
                onDelete={() => handleDeleteExamClick(exam)}
                onAddQuestion={() => {
                  // We need to manage state for which exam is adding a question.
                  // Assuming single active editing for simplicity or map state.
                  // For now, let's allow adding questions directly inline in the card component.
                }}
                isAddingQuestion={isAddingQuestion} // Needs refactoring to be exam-specific if multiple allowed simultaneously
                setIsAddingQuestion={setIsAddingQuestion} // This is shared state, might be weird.
                // Better approach: pass handleAddQuestionSubmit wrapper that knows exam ID
                onAddQuestionSubmit={(data) =>
                  addQuestion({ examId: exam._id, data })
                }
                isAddingQ={isAddingQ}
                handleRemoveQuestion={(qId) => {
                  // Pass examId and qId to wrapper
                  if (
                    window.confirm(
                      "Are you sure you want to delete this question?"
                    )
                  ) {
                    removeQuestion({ examId: exam._id, questionId: qId });
                  }
                }}
              />
            ))}
          </div>
        ) : (
          !isAddingExam && (
            <div className="text-center py-6 text-text-muted italic">
              No exams created for this course.
            </div>
          )
        )}
      </div>
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.title}
        message={deleteModal.message}
        onConfirm={deleteModal.onConfirm}
        onCancel={closeDeleteModal}
        isLoading={
          deleteModal.isLoading ||
          isDeletingLecture ||
          isDeletingLesson ||
          isDeletingAssignment ||
          isDeletingExam
        }
      />
    </div>
  );
};

const LectureContent = ({
  courseId, // Added courseId
  lectureId,
  updateLesson,
  deleteLesson,
  addingLessonToLectureId,
  setAddingLessonToLectureId,
  handleAddLessonSubmit,
  isCreatingLesson,
  editingLessonId,
  setEditingLessonId,
  handleEditLessonSubmit,
  isUpdatingLesson,
  // Assignments
  assignments,
  addingAssignmentToLectureId,
  setAddingAssignmentToLectureId,
  handleAddAssignmentSubmit,
  isCreatingAssignment,
  editingAssignmentId,
  setEditingAssignmentId,
  updateAssignment,
  isUpdatingAssignment,
  deleteAssignment,
}) => {
  const queryClient = useQueryClient();
  const { data: lessons = [], isLoading: isLoadingLessons } =
    useLessonsByLecture(lectureId);
  // Fetch blogs for the course (we'll filter client-side for now as per assumption)
  const { data: allBlogs = [] } = useCourseBlogs(courseId, { limit: 1000 });

  // Filter blogs for this lecture. Assuming blog has 'lecture' field.
  // If not, we might need to rely only on the 'items' order if backend is polymorphic,
  // but for creating/displaying initially we need a criteria.
  const blogs = Array.isArray(allBlogs)
    ? allBlogs.filter(
        (b) => b.lecture === lectureId || b.lecture?._id === lectureId
      )
    : [];

  const { mutate: createBlog, isPending: isCreatingBlog } = useCreateBlog({
    onSuccess: () => {
      notification.success("Blog created!");
      setAddingBlog(false);
    },
  });

  const { mutate: updateBlog, isPending: isUpdatingBlog } = useUpdateBlog({
    onSuccess: () => {
      notification.success("Blog updated!");
      setEditingBlogId(null);
    },
  });

  const { mutate: deleteBlog, isPending: isDeletingBlog } = useDeleteBlog({
    onSuccess: () => {
      notification.success("Blog deleted!");
      // Modal closed by parent via context/ref ideally, or we pass a handler
    },
  });

  const [addingBlog, setAddingBlog] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);

  // Merge and Sort Items
  const items = [
    ...lessons.map((l) => ({ ...l, type: "lesson" })),
    ...blogs.map((b) => ({ ...b, type: "blog" })),
  ].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleMoveItem = async (index, direction) => {
    if (index < 0 || index >= items.length) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;

    const newItems = [...items];
    const itemToMove = newItems[index];
    const itemToSwap = newItems[newIndex];

    // Swap orders
    const tempOrder = itemToMove.order;
    itemToMove.order = itemToSwap.order;
    itemToSwap.order = tempOrder;

    // Swap positions in array
    newItems[index] = itemToSwap;
    newItems[newIndex] = itemToMove;

    // Call API
    const updates = newItems.map((item, idx) => ({
      id: item._id,
      order: idx + 1, // Ensure 1-based sequential order
    }));

    try {
      await LectureItemService.updateItemsOrder(lectureId, updates);
      // We need to invalidate the "lessons" and "course-blogs" queries to reflect the new order
      queryClient.invalidateQueries({ queryKey: ["lessons", lectureId] });
      // We also invalidate course blogs as they are part of the mixed list
      queryClient.invalidateQueries({ queryKey: ["course-blogs", courseId] });

      notification.success("Order updated");
    } catch (e) {
      console.error(e);
      notification.error("Failed to reorder");
    }
  };

  const handleDeleteBlogClick = (blog) => {
    // Use parent modal logic if possible, or local simple confirm
    if (window.confirm(`Delete blog "${blog.title}"?`)) {
      deleteBlog(blog._id);
    }
  };

  return (
    <div className="p-4 border-t border-border space-y-4 bg-background/5">
      {/* Mixed Content Section */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">
          Curriculum Items
        </h4>

        {isLoadingLessons ? (
          <div className="p-3 animate-pulse bg-gray-100 rounded"></div>
        ) : items.length > 0 ? (
          items.map((item, index) => (
            <div key={item._id} className="relative">
              {item.type === "lesson" ? (
                editingLessonId === item._id ? (
                  <LessonForm
                    initialData={item}
                    onSubmit={(data) => handleEditLessonSubmit(data, item)}
                    onCancel={() => setEditingLessonId(null)}
                    isLoading={isUpdatingLesson}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <button
                        disabled={index === 0}
                        onClick={() => handleMoveItem(index, -1)}
                        className="text-text-muted hover:text-primary disabled:opacity-30"
                      >
                        <FaArrowUp size={10} />
                      </button>
                      <button
                        disabled={index === items.length - 1}
                        onClick={() => handleMoveItem(index, 1)}
                        className="text-text-muted hover:text-primary disabled:opacity-30"
                      >
                        <FaArrowDown size={10} />
                      </button>
                    </div>
                    <div className="flex-1">
                      <LessonItem
                        lesson={item}
                        updateLesson={updateLesson}
                        deleteLesson={deleteLesson}
                        onEdit={() => setEditingLessonId(item._id)}
                      />
                    </div>
                  </div>
                )
              ) : // Blog Item
              editingBlogId === item._id ? (
                <BlogForm
                  initialData={item}
                  onSubmit={(data) =>
                    updateBlog({
                      id: item._id,
                      data: { ...data, course: courseId },
                    })
                  }
                  onCancel={() => setEditingBlogId(null)}
                  isLoading={isUpdatingBlog}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <button
                      disabled={index === 0}
                      onClick={() => handleMoveItem(index, -1)}
                      className="text-text-muted hover:text-primary disabled:opacity-30"
                    >
                      <FaArrowUp size={10} />
                    </button>
                    <button
                      disabled={index === items.length - 1}
                      onClick={() => handleMoveItem(index, 1)}
                      className="text-text-muted hover:text-primary disabled:opacity-30"
                    >
                      <FaArrowDown size={10} />
                    </button>
                  </div>
                  <div className="flex-1">
                    <BlogItem
                      blog={item}
                      onEdit={() => setEditingBlogId(item._id)}
                      onDelete={() => handleDeleteBlogClick(item)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-xs text-text-muted">No items yet.</p>
        )}

        {/* Add Buttons */}
        <div className="flex gap-2">
          {!addingBlog &&
            (addingLessonToLectureId === lectureId ? (
              <div className="w-full">
                <LessonForm
                  onSubmit={(data) =>
                    handleAddLessonSubmit(data, lectureId, items.length)
                  }
                  onCancel={() => setAddingLessonToLectureId(null)}
                  isLoading={isCreatingLesson}
                />
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setAddingLessonToLectureId(lectureId)}
              >
                <FaPlus /> Add Lesson
              </Button>
            ))}

          {addingLessonToLectureId !== lectureId &&
            (addingBlog ? (
              <div className="w-full">
                <BlogForm
                  onSubmit={(data) => {
                    createBlog({
                      ...data,
                      course: courseId,
                      lecture: lectureId,
                      order: items.length + 1, // Add logic to backend to use this
                    });
                  }}
                  onCancel={() => setAddingBlog(false)}
                  isLoading={isCreatingBlog}
                />
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setAddingBlog(true)}
              >
                <FaFileAlt /> Add Blog
              </Button>
            ))}
        </div>
      </div>

      {/* Assignments Section */}
      <div className="pt-4 border-t border-border space-y-3">
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">
          Assignments
        </h4>

        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div key={assignment._id}>
              {editingAssignmentId === assignment._id ? (
                <AssignmentForm
                  initialData={assignment}
                  onSubmit={(data) =>
                    updateAssignment({ id: assignment._id, data })
                  }
                  onCancel={() => setEditingAssignmentId(null)}
                  isLoading={isUpdatingAssignment}
                />
              ) : (
                <AssignmentItem
                  assignment={assignment}
                  onEdit={() => setEditingAssignmentId(assignment._id)}
                  onDelete={() => deleteAssignment(assignment)}
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-xs text-text-muted py-2">
            No assignments.
          </p>
        )}

        {addingAssignmentToLectureId === lectureId ? (
          <AssignmentForm
            onSubmit={(data) => handleAddAssignmentSubmit(data, lectureId)}
            onCancel={() => setAddingAssignmentToLectureId(null)}
            isLoading={isCreatingAssignment}
          />
        ) : (
          <Button
            variant="outline"
            size="sm"
            fullWidth
            className="border-dashed flex items-center justify-center gap-2 hover:bg-accent/5 hover:border-accent transition-all text-accent"
            onClick={() => setAddingAssignmentToLectureId(lectureId)}
          >
            <FaClipboardList /> Add Assignment
          </Button>
        )}
      </div>
    </div>
  );
};

const LessonItem = ({ lesson, updateLesson, deleteLesson, onEdit }) => {
  const [isUploading, setIsUploading] = useState(false);

  if (!lesson) return null;

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("video", file);
      const response = await LessonsService.uploadVideo(formData);
      // backend returns { videoUrl: "public_id" } which is the publicId
      updateLesson({
        id: lesson._id,
        data: { ...lesson, publicId: response.videoUrl },
      });
      notification.success("Video uploaded successfully!");
    } catch (err) {
      console.error(err);
      notification.error("Failed to upload video.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-3 bg-surface border border-border rounded-lg flex items-center justify-between group hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
          {lesson.order}
        </div>
        <div>
          <p className="text-sm font-medium text-text-main">{lesson.title}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-text-muted flex items-center gap-1">
              <FaVideo size={10} className="text-info" />{" "}
              {lesson.publicId || lesson.url || lesson.videoUrl
                ? "Video uploaded"
                : "No video"}
            </span>
            <span className="text-xs text-text-muted flex items-center gap-1">
              <FaClock size={10} className="text-warning" /> {lesson.duration}s
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <label
          title="Upload Video"
          className="cursor-pointer p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
        >
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleVideoUpload}
            disabled={isUploading}
          />
          <FaVideo className={isUploading ? "animate-spin" : ""} />
        </label>
        <Button variant="ghost" size="sm" onClick={onEdit} title="Edit Lesson">
          <FaEdit className="text-info" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteLesson(lesson)}
          title="Delete Lesson"
        >
          <FaTrash className="text-error" />
        </Button>
      </div>
    </div>
  );
};

const AssignmentItem = ({ assignment, onEdit, onDelete }) => {
  const [isExpanding, setIsExpanding] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(false);

  // Question mutations
  const { mutate: createQuestion, isPending: isCreatingQuestion } =
    useCreateQuestion({
      onSuccess: () => {
        notification.success("Question created!");
        setAddingQuestion(false);
      },
    });

  const { mutate: deleteQuestion } = useDeleteQuestion({
    onSuccess: () => notification.success("Question deleted!"),
  });

  const { mutate: updateQuestion, isPending: isUpdatingQuestion } =
    useUpdateQuestion({
      onSuccess: () => notification.success("Question updated!"),
    });

  // Assignments questions would ideally be in the 'assignment' object if populated, or we fetch them.
  // Assuming backend returns 'questions' array in assignment for now, or we fetch separate?
  // Assignment.md endpoint Get Assignment by ID returns structure without questions array explicitly shown in docs?
  // "Question Services" exist separately.
  // Fetching assignment details (with questions) is better? Or passing from parent?
  // Let's assume we need to use 'useAssignment' to get full details including questions as standard list endpoints might be light.
  // However, for simplified UX here, I'll rely on what's passed or fetched if expanding.

  // For now, let's implement the UI assuming we might need to fetch questions if expanded.

  return (
    <div className="p-3 bg-surface border border-border rounded-lg group hover:border-accent/30 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">
            <FaClipboardList />
          </div>
          <div>
            <p className="text-sm font-medium text-text-main">
              {assignment.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanding(!isExpanding)}
            title="Manage Questions"
          >
            <FaQuestionCircle className="text-success" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            title="Edit Assignment"
          >
            <FaEdit className="text-info" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            title="Delete Assignment"
          >
            <FaTrash className="text-error" />
          </Button>
        </div>
      </div>

      {isExpanding && (
        <div className="mt-4 pl-4 border-l-2 border-accent/20">
          <AssignmentQuestionsManager
            assignmentId={assignment._id}
            isAdding={addingQuestion}
            setIsAdding={setAddingQuestion}
            createQuestion={createQuestion}
            isCreatingQuestion={isCreatingQuestion}
            deleteQuestion={deleteQuestion}
            updateQuestion={updateQuestion}
            isUpdatingQuestion={isUpdatingQuestion}
          />
        </div>
      )}
    </div>
  );
};

// Separate component to handle fetching questions for an assignment when expanded

const AssignmentQuestionsManager = ({
  assignmentId,
  isAdding,
  setIsAdding,
  createQuestion,
  isCreatingQuestion,
  deleteQuestion,
  updateQuestion,
  isUpdatingQuestion,
}) => {
  const { data: questions = [], isLoading } =
    useQuestionsByAssignment(assignmentId);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const handleUpdateSubmit = (data) => {
    updateQuestion({ id: editingQuestionId, data });
    setEditingQuestionId(null);
  };

  return (
    <div className="space-y-3">
      <h5 className="text-xs font-bold text-text-muted">Questions</h5>
      {isLoading ? (
        <p className="text-xs">Loading questions...</p>
      ) : (
        <div className="space-y-2">
          {questions.map((q, idx) => (
            <div key={q._id || idx}>
              {editingQuestionId === q._id ? (
                <QuestionForm
                  initialData={q}
                  assignment={assignmentId}
                  onSubmit={handleUpdateSubmit}
                  onCancel={() => setEditingQuestionId(null)}
                  isLoading={isUpdatingQuestion}
                />
              ) : (
                <div className="flex justify-between items-center p-2 bg-background rounded text-sm border border-border">
                  <span>
                    {idx + 1}. {q.title}
                  </span>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingQuestionId(q._id)}
                      className="text-info w-8 h-8"
                      title="Edit Question"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteQuestion(q._id)}
                      className="text-error w-8 h-8"
                      title="Delete Question"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {questions.length === 0 && (
            <p className="text-xs text-text-muted italic">
              No questions added.
            </p>
          )}
        </div>
      )}

      {isAdding ? (
        <QuestionForm
          assignment={assignmentId}
          onSubmit={(data) =>
            createQuestion({ ...data, assignment: assignmentId })
          }
          onCancel={() => setIsAdding(false)}
          isLoading={isCreatingQuestion}
        />
      ) : (
        !editingQuestionId && (
          <Button
            size="sm"
            variant="ghost"
            className="text-xs flex items-center gap-1 text-primary"
            onClick={() => setIsAdding(true)}
          >
            <FaPlus size={10} /> Add Question
          </Button>
        )
      )}
    </div>
  );
};

const BlogItem = ({ blog, onEdit, onDelete }) => {
  return (
    <div className="p-3 bg-surface border border-border rounded-lg flex items-center justify-between group hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xs font-bold">
          {blog.order}
        </div>
        <div>
          <p className="text-sm font-medium text-text-main">{blog.title}</p>
          <span className="text-xs text-text-muted flex items-center gap-1">
            <FaFileAlt size={10} /> Blog Post
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" onClick={onEdit} title="Edit Blog">
          <FaEdit className="text-info" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          title="Delete Blog"
        >
          <FaTrash className="text-error" />
        </Button>
      </div>
    </div>
  );
};

const BlogForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [thumbnail, setThumbnail] = useState(
    initialData?.thumbnail || "https://placehold.co/600x400"
  ); // Start with placeholder

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, thumbnail });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-background border border-border rounded-xl space-y-4"
    >
      <div>
        <label className="block text-sm font-bold mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-border rounded opacity-80"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border border-border rounded opacity-80 h-32"
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Blog"}
        </Button>
      </div>
    </form>
  );
};

export default CurriculumManager;
