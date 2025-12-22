import { useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaVideo,
  FaClock,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import Button from "../../../shared/components/Button";
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
import CloudinaryService from "../../../services/CloudinaryService";
import notification from "../../../utils/notification";
import LectureForm from "./LectureForm";
import LessonForm from "./LessonForm";

const CurriculumManager = ({ courseId }) => {
  const [expandedLectures, setExpandedLectures] = useState({});
  const [isAddingLecture, setIsAddingLecture] = useState(false);
  const [editingLectureId, setEditingLectureId] = useState(null);
  const [addingLessonToLectureId, setAddingLessonToLectureId] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);

  const { data: lectures = [], isLoading: isLoadingLectures } =
    useLecturesByCourse(courseId);

  const { mutate: createLecture, isPending: isCreatingLecture } =
    useCreateLecture({
      onSuccess: () => {
        notification.success("Lecture created!");
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
        notification.success("Lecture updated!");
        setEditingLectureId(null);
      },
      onError: (err) =>
        notification.error(
          err?.response?.data?.message || "Failed to update lecture"
        ),
    });

  const { mutate: deleteLecture } = useDeleteLecture(courseId, {
    onSuccess: () => notification.success("Lecture deleted!"),
    onError: (err) =>
      notification.error(
        err?.response?.data?.message || "Failed to delete lecture"
      ),
  });

  const { mutate: createLesson, isPending: isCreatingLesson } = useCreateLesson(
    {
      onSuccess: () => {
        notification.success("Lesson created!");
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
        notification.success("Lesson updated!");
        setEditingLessonId(null);
      },
      onError: (err) =>
        notification.error(
          err?.response?.data?.message || "Failed to update lesson"
        ),
    }
  );

  const { mutate: deleteLesson } = useDeleteLesson({
    onSuccess: () => notification.success("Lesson deleted!"),
    onError: (err) =>
      notification.error(
        err?.response?.data?.message || "Failed to delete lesson"
      ),
  });

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

  const handleDeleteLecture = (id) => {
    if (window.confirm("Delete this lecture and all its lessons?")) {
      deleteLecture(id);
    }
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
                        onClick={() => handleDeleteLecture(lecture._id)}
                      >
                        <FaTrash className="text-error" />
                      </Button>
                    </div>
                  </div>
                )}

                {expandedLectures[lecture._id] &&
                  editingLectureId !== lecture._id && (
                    <LectureLessons
                      lectureId={lecture._id}
                      updateLesson={updateLesson}
                      deleteLesson={deleteLesson}
                      addingLessonToLectureId={addingLessonToLectureId}
                      setAddingLessonToLectureId={setAddingLessonToLectureId}
                      handleAddLessonSubmit={handleAddLessonSubmit}
                      isCreatingLesson={isCreatingLesson}
                      editingLessonId={editingLessonId}
                      setEditingLessonId={setEditingLessonId}
                      handleEditLessonSubmit={handleEditLessonSubmit}
                      isUpdatingLesson={isUpdatingLesson}
                    />
                  )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const LectureLessons = ({
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
}) => {
  const { data: lessons = [], isLoading } = useLessonsByLecture(lectureId);

  return (
    <div className="p-4 border-t border-border space-y-3 bg-background/5">
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

  const handleDelete = () => {
    if (window.confirm("Delete this lesson?")) {
      deleteLesson(lesson._id);
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
              <FaClock size={10} className="text-warning" /> {lesson.duration}m
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
          onClick={handleDelete}
          title="Delete Lesson"
        >
          <FaTrash className="text-error" />
        </Button>
      </div>
    </div>
  );
};

export default CurriculumManager;
