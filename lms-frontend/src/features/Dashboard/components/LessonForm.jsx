import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaSave,
  FaTimes,
  FaVideo,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import Button from "../../../shared/components/Button";
import LessonsService from "../../../services/LessonsService";
import notification from "../../../utils/notification";

const LessonForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [isUploading, setIsUploading] = useState(false);
  // Use publicId based on lessons_api.md
  const [publicId, setPublicId] = useState(
    initialData?.publicId || initialData?.videoUrl || ""
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      title: "",
      description: "",
      duration: 0,
      isOpen: false,
    },
  });

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Detect duration
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const durationInSeconds = Math.round(video.duration);
      setValue("duration", durationInSeconds);
    };
    video.src = URL.createObjectURL(file);

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("video", file);

      const response = await LessonsService.uploadVideo(formData);
      // The backend returns { videoUrl: "public_id" }
      setPublicId(response.videoUrl);
      notification.success("Video uploaded successfully!");
    } catch (err) {
      console.error(err);
      notification.error("Failed to upload video.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit({ ...data, publicId }))}
      className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-text-main">
          {initialData ? "Edit Lesson" : "Add New Lesson"}
        </h4>
        <button
          type="button"
          onClick={onCancel}
          className="text-text-muted hover:text-error transition-colors"
        >
          <FaTimes />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
            Lesson Title
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
            placeholder="e.g. Setting up the environment"
          />
          {errors.title && (
            <p className="text-error text-[10px] mt-1 font-medium">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm min-h-[80px]"
            placeholder="Short summary of what this lesson covers..."
          />
          {errors.description && (
            <p className="text-error text-[10px] mt-1 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("isOpen")}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/50 transition-all"
            />
            <div>
              <span className="text-sm font-bold text-text-main">
                Allow Preview (Public)
              </span>
              <p className="text-xs text-text-muted">
                If checked, this lesson will be visible to users without
                enrollment.
              </p>
            </div>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-primary">
            Video Content
          </label>
          <div className="relative">
            <input
              type="file"
              accept="video/*"
              className="hidden"
              id="video-upload"
              onChange={handleVideoUpload}
              disabled={isUploading}
            />
            <label
              htmlFor="video-upload"
              className={`flex items-center justify-center gap-2 w-full border-2 border-dashed rounded-lg p-6 text-sm font-medium cursor-pointer transition-all ${
                publicId
                  ? "border-success bg-success/5 text-success"
                  : "border-border hover:border-primary hover:text-primary bg-background/50"
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <FaSpinner className="animate-spin text-2xl" />
                  <span>Uploading Video...</span>
                </div>
              ) : publicId ? (
                <div className="flex flex-col items-center gap-2">
                  <FaCheckCircle className="text-2xl" />
                  <span>Video Ready & Duration Detected</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-text-muted">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <FaVideo size={20} />
                  </div>
                  <span>Click to upload lesson video</span>
                  <span className="text-[10px] opacity-60">
                    MP4, WebM or Ogg (Max 100MB)
                  </span>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isLoading || isUploading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="flex items-center gap-2"
          disabled={isLoading || isUploading || (!publicId && !initialData)}
        >
          <FaSave /> {isLoading ? "Saving..." : "Save Lesson"}
        </Button>
      </div>
    </form>
  );
};

export default LessonForm;
