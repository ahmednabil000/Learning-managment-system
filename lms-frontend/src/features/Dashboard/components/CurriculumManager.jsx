import { useState } from "react";
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
  const { data: courseAssignments = [], isLoading: isLoadingAssignments } =
    useAssignmentsByCourse(courseId);

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
      order: lessonCount + 1,
    });
  };

  const handleEditLessonSubmit = (data, lesson) => {
    updateLesson({ id: lesson._id, data: { ...lesson, ...data } });
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

      {/* Reusable Confirm Deletion Modal */}
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
          isDeletingAssignment
        }
      />
    </div>
  );
};

const LectureContent = ({
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
  const { data: lessons = [], isLoading } = useLessonsByLecture(lectureId);
  const { data: assignments = [] } = useAssignmentsByLecture(lectureId);
  return (
    <div className="p-4 border-t border-border space-y-4 bg-background/5">
      {/* Lessons Section */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">
          Lessons
        </h4>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-3 bg-surface border border-border rounded-lg animate-pulse h-12"
              ></div>
            ))}
          </div>
        ) : lessons.length > 0 ? (
          [...lessons]
            .sort((a, b) => a.order - b.order)
            .map((lesson) => (
              <div key={lesson._id}>
                {editingLessonId === lesson._id ? (
                  <LessonForm
                    initialData={{
                      title: lesson.title,
                      description: lesson.description,
                      duration: lesson.duration,
                      videoUrl: lesson.videoUrl,
                    }}
                    onSubmit={(data) => handleEditLessonSubmit(data, lesson)}
                    onCancel={() => setEditingLessonId(null)}
                    isLoading={isUpdatingLesson}
                  />
                ) : (
                  <LessonItem
                    lesson={lesson}
                    updateLesson={updateLesson}
                    deleteLesson={deleteLesson}
                    onEdit={() => setEditingLessonId(lesson._id)}
                  />
                )}
              </div>
            ))
        ) : (
          <p className="text-center text-xs text-text-muted py-2">
            No lessons in this lecture.
          </p>
        )}

        {addingLessonToLectureId === lectureId ? (
          <LessonForm
            onSubmit={(data) =>
              handleAddLessonSubmit(data, lectureId, lessons.length)
            }
            onCancel={() => setAddingLessonToLectureId(null)}
            isLoading={isCreatingLesson}
          />
        ) : (
          <Button
            variant="outline"
            size="sm"
            fullWidth
            className="border-dashed flex items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary transition-all"
            onClick={() => setAddingLessonToLectureId(lectureId)}
          >
            <FaPlus /> Add Lesson
          </Button>
        )}
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
      const url = await CloudinaryService.uploadFile(file, "video");
      updateLesson({ id: lesson._id, data: { ...lesson, videoUrl: url } });
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
              {lesson.videoUrl === "placeholder"
                ? "No video"
                : "Video uploaded"}
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

export default CurriculumManager;
