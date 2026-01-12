import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FaArrowLeft,
  FaSave,
  FaImage,
  FaTag,
  FaDollarSign,
  FaPlus,
} from "react-icons/fa";
import Button from "../../shared/components/Button";
import {
  useCourse,
  useCreateCourse,
  useUpdateCourse,
} from "../../hooks/useCourses";
import { useTags } from "../../hooks/useTags";
import CloudinaryService from "../../services/CloudinaryService";
import CurriculumManager from "./components/CurriculumManager";
import CourseRequirementsManager from "./components/CourseRequirementsManager";
import notification from "../../utils/notification";

const CourseFormPage = ({ mode = "create" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { data: course, isLoading: isLoadingCourse } = useCourse(id);
  const { data: tagsData } = useTags({ pageCount: 100 });
  const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      tag: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && course) {
      setValue("title", course.title);
      setValue("description", course.description);
      setValue("price", course.price);
      // Map 'tag' from backend to 'tag' in form. Handle object or string.
      const tagValue =
        typeof course.tag === "object" ? course.tag?._id : course.tag;
      setValue("tag", tagValue || "");
      setValue("level", course.level || "");
      setImageUrl(course.imageUrl || "");
    }
  }, [course, mode, setValue]);

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
    console.log(data);
    const payload = {
      title: data.title,
      description: data.description,
      price: Number(data.price),
      imageUrl,
      tag: data.tag,
      level: data.level,
    };

    if (mode === "create") {
      createCourse(payload, {
        onSuccess: (newCourse) => {
          navigate(`/dashboard/courses/${newCourse._id}/edit`);
          notification.success("Course created successfully!");
          setActiveTab("curriculum");
        },
        onError: (error) => {
          notification.error(
            error?.response?.data?.message || "Failed to create course."
          );
        },
      });
    } else {
      updateCourse(
        { id, data: payload },
        {
          onSuccess: () => {
            notification.success("Course updated successfully!");
          },
          onError: (error) => {
            notification.error(
              error?.response?.data?.message || "Failed to update course."
            );
          },
        }
      );
    }
  };

  if (mode === "edit" && isLoadingCourse) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        Loading course data...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/courses")}
          >
            <FaArrowLeft />
          </Button>
          <h1 className="heading-l text-text-main">
            {mode === "create" ? "Create New Course" : "Edit Course"}
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
            activeTab === "curriculum"
              ? "text-primary"
              : "text-text-muted hover:text-text-main"
          }`}
          disabled={mode === "create"}
          onClick={() => setActiveTab("curriculum")}
        >
          Curriculum {mode === "create" && "(Save first)"}
          {activeTab === "curriculum" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>
          )}
        </button>
        <button
          className={`pb-4 px-2 font-bold transition-colors relative ${
            activeTab === "requirements"
              ? "text-primary"
              : "text-text-muted hover:text-text-main"
          }`}
          disabled={mode === "create"}
          onClick={() => setActiveTab("requirements")}
        >
          Requirements & Learning
          {activeTab === "requirements" && (
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
                  Course Title
                </label>
                <input
                  {...register("title", {
                    required: "Title is required",
                    minLength: 5,
                    maxLength: 50,
                  })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="e.g. Mastering React Hooks"
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
                    maxLength: 700,
                  })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all min-h-[150px]"
                  placeholder="Tell students what they will learn..."
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
                <label className="text-sm font-bold text-text-main mb-2 flex items-center gap-2">
                  <FaDollarSign className="text-success" /> Price ($)
                </label>
                <input
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    min: 0,
                  })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50"
                />
                {errors.price && (
                  <p className="text-error text-xs mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-bold text-text-main mb-2 flex items-center gap-2">
                  <FaTag className="text-info" /> Primary Tag
                </label>
                <select
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50"
                  {...register("tag")}
                >
                  <option value="">Select a tag</option>
                  {(tagsData?.tags || []).map((tag) => (
                    <option key={tag._id} value={tag._id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-bold text-text-main mb-2 flex items-center gap-2">
                  <FaTag className="text-warning" /> Difficulty Level
                </label>
                <select
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 capitalize"
                  {...register("level", { required: "Level is required" })}
                >
                  <option value="">Select difficulty level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                {errors.level && (
                  <p className="text-error text-xs mt-1">
                    {errors.level.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
              <label className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
                <FaImage className="text-primary" /> Course Thumbnail
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
                    <p className="text-xs text-text-muted">
                      Upload high resolution image (16:9)
                    </p>
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

            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
              <h4 className="font-bold text-primary mb-2 italic">Pro Tip!</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Courses with professional thumbnails and clear descriptions have
                5x higher enrollment rates. Make sure your video quality is at
                least 1080p.
              </p>
            </div>
          </div>
        </div>
      ) : activeTab === "requirements" ? (
        <div className="mt-6">
          <CourseRequirementsManager
            courseId={id}
            learning={course?.learning || []}
            requirements={course?.requirements || []}
          />
        </div>
      ) : (
        <div className="mt-6">
          <CurriculumManager courseId={id} />
        </div>
      )}
    </div>
  );
};

export default CourseFormPage;
