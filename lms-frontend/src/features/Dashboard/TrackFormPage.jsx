import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FaArrowLeft,
  FaSave,
  FaImage,
  FaPlus,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import Button from "../../shared/components/Button";
import {
  useTrack,
  useCreateTrack,
  useUpdateTrack,
  useAddCourseToTrack,
  useRemoveCourseFromTrack,
} from "../../hooks/useTracks";
import { useInstructorCourses } from "../../hooks/useCourses";
import CloudinaryService from "../../services/CloudinaryService";
import notification from "../../utils/notification";
import ConfirmModal from "../../shared/components/ConfirmModal";

const CourseSelectionModal = ({
  isOpen,
  onClose,
  onSelect,
  availableCourses,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filteredCourses = availableCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-surface w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-border">
          <h3 className="heading-m text-text-main mb-2">Select Course</h3>
          <div className="bg-background border border-border rounded-lg flex items-center px-3 py-2">
            <FaSearch className="text-text-muted mr-2" />
            <input
              type="text"
              placeholder="Search courses..."
              className="bg-transparent border-none outline-none w-full text-text-main"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-y-auto p-4 flex-1">
          {filteredCourses.length === 0 ? (
            <p className="text-center text-text-muted py-8">
              No available courses found.
            </p>
          ) : (
            <div className="space-y-2">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-background/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {course.imageUrl && (
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-text-main">
                        {course.title}
                      </p>
                      <p className="text-xs text-text-muted truncate max-w-xs">
                        {course.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onSelect(course._id)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding..." : "Add"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-border flex justify-end">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

import useAuthStore from "../../Stores/authStore";

const TrackFormPage = ({ mode = "create" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("general");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  // Track Data
  const { data: track, isLoading: isLoadingTrack } = useTrack(id);
  const { mutate: createTrack, isPending: isCreating } = useCreateTrack();
  const { mutate: updateTrack, isPending: isUpdating } = useUpdateTrack();
  const { mutate: addCourse, isPending: isAddingCourse } =
    useAddCourseToTrack();
  const { mutate: removeCourse, isPending: isRemovingCourse } =
    useRemoveCourseFromTrack();

  // Instructor Courses for selection
  const { data: validCourses } = useInstructorCourses();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      discount: 0,
      isActive: false,
    },
  });

  useEffect(() => {
    if (mode === "edit" && track) {
      setValue("title", track.title);
      setValue("description", track.description);
      setValue("discount", track.discount || 0);
      setValue("isActive", track.isActive || false);
      setImageUrl(track.thumbnail || "");
    }
  }, [track, mode, setValue]);

  const onImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await CloudinaryService.uploadFile(file, "image");
      setImageUrl(url);
    } catch (err) {
      console.error(err);
      notification.error("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (data) => {
    const payload = {
      title: data.title,
      description: data.description,
      discount: Number(data.discount),
      isActive: data.isActive,
      thumbnail: imageUrl,
      user: user?._id || user?.id,
    };

    if (mode === "create") {
      createTrack(payload, {
        onSuccess: (newTrack) => {
          navigate(`/dashboard/tracks/${newTrack._id}/edit`);
          notification.success("Track created successfully!");
          setActiveTab("courses");
        },
        onError: (error) => {
          notification.error(
            error?.response?.data?.message || "Failed to create track."
          );
        },
      });
    } else {
      updateTrack(
        { id, data: payload },
        {
          onSuccess: () => {
            notification.success("Track updated successfully!");
          },
          onError: (error) => {
            notification.error(
              error?.response?.data?.message || "Failed to update track."
            );
          },
        }
      );
    }
  };

  const handleAddCourse = (courseId) => {
    addCourse(
      { trackId: id, courseId },
      {
        onSuccess: () => {
          notification.success("Course added to track!");
          setIsCourseModalOpen(false);
        },
        onError: (error) =>
          notification.error(
            error?.response?.data?.message || "Failed to add course."
          ),
      }
    );
  };

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    isLoading: false,
  });

  const handleRemoveCourse = (courseId) => {
    setConfirmModal({
      isOpen: true,
      title: "Remove Course",
      message: "Are you sure you want to remove this course from the track?",
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        removeCourse(
          { trackId: id, courseId },
          {
            onSuccess: () => {
              notification.success("Course removed from track!");
              setConfirmModal({
                isOpen: false,
                isLoading: false,
                title: "",
                message: "",
                onConfirm: null,
              });
            },
            onError: (error) => {
              notification.error(
                error?.response?.data?.message || "Failed to remove course."
              );
              setConfirmModal((prev) => ({ ...prev, isLoading: false }));
            },
          }
        );
      },
      isLoading: false,
    });
  };

  if (mode === "edit" && isLoadingTrack) {
    return (
      <div className="flex items-center justify-center p-12">
        Loading track...
      </div>
    );
  }

  // Filter available courses (exclude already added ones)
  const availableCourses = (validCourses || []).filter(
    (c) => !track?.courses?.some((tc) => tc._id === c._id)
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/tracks")}
          >
            <FaArrowLeft />
          </Button>
          <h1 className="heading-l text-text-main">
            {mode === "create" ? "Create New Track" : "Edit Track"}
          </h1>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="primary"
          className="flex items-center gap-2"
          disabled={isCreating || isUpdating}
        >
          <FaSave /> {mode === "create" ? "Save & Continue" : "Save Changes"}
        </Button>
      </div>

      <div className="flex border-b border-border gap-8">
        <button
          className={`pb-4 px-2 font-bold transition-colors relative ${
            activeTab === "general"
              ? "text-primary"
              : "text-text-muted hover:text-text-main"
          }`}
          onClick={() => setActiveTab("general")}
        >
          General Information
          {activeTab === "general" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>
          )}
        </button>
        <button
          className={`pb-4 px-2 font-bold transition-colors relative ${
            activeTab === "courses"
              ? "text-primary"
              : "text-text-muted hover:text-text-main"
          }`}
          disabled={mode === "create"}
          onClick={() => setActiveTab("courses")}
        >
          Courses {mode === "create" && "(Save first)"}
          {activeTab === "courses" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>
          )}
        </button>
      </div>

      {activeTab === "general" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-bold text-text-main mb-2">
                  Track Title
                </label>
                <input
                  {...register("title", {
                    required: "Title is required",
                    minLength: 5,
                  })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Master Backend Development"
                />
                {errors.title && (
                  <p className="text-error text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-text-main mb-2">
                  Description
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                    minLength: 10,
                  })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 min-h-[150px]"
                  placeholder="Describe the track..."
                />
                {errors.description && (
                  <p className="text-error text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-text-main mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  {...register("discount", { min: 0, max: 100 })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50"
                />
              </div>
              {mode === "edit" && (
                <div className="flex items-center gap-3">
                  <label className="text-sm font-bold text-text-main">
                    Status:
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("isActive")}
                      className="hidden peer"
                    />
                    <div className="w-10 h-6 bg-border rounded-full peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all relative"></div>
                    <span className="ml-3 text-sm text-text-muted">
                      {watch("isActive") ? "Active" : "Draft"}
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
              <label className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
                <FaImage className="text-primary" /> Track Thumbnail
              </label>
              <div
                className={`aspect-video rounded-xl border-2 border-dashed border-border overflow-hidden relative flex items-center justify-center transition-all ${
                  !imageUrl &&
                  "bg-background/50 hover:bg-background hover:border-primary"
                }`}
              >
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-bold">
                        Change Image
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={onImageUpload}
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2 p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <FaPlus />
                    </div>
                    <p className="text-xs text-text-muted">Upload image</p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={onImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                    <p className="text-primary font-bold animate-pulse">
                      Uploading...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="heading-m text-text-main">Courses in this Track</h2>
            <Button
              variant="outline"
              onClick={() => setIsCourseModalOpen(true)}
            >
              <FaPlus className="mr-2" /> Add Course
            </Button>
          </div>

          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            {track?.courses?.length > 0 ? (
              <div className="divide-y divide-border">
                {track.courses.map((course) => (
                  <div
                    key={course._id}
                    className="p-4 flex items-center justify-between hover:bg-background/50"
                  >
                    <div className="flex items-center gap-4">
                      {course.imageUrl && (
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-bold text-text-main">
                          {course.title}
                        </p>
                        <p className="text-xs text-text-muted">
                          {course.description
                            ? course.description.substring(0, 60) + "..."
                            : ""}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-error hover:bg-error/10"
                      onClick={() => handleRemoveCourse(course._id)}
                      disabled={isRemovingCourse}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-text-muted">
                No courses in this track yet. Add some courses.
              </div>
            )}
          </div>
        </div>
      )}

      <CourseSelectionModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSelect={handleAddCourse}
        availableCourses={availableCourses}
        isLoading={isAddingCourse}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        isLoading={confirmModal.isLoading}
      />
    </div>
  );
};

export default TrackFormPage;
