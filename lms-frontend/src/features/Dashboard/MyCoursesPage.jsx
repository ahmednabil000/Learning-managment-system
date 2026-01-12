import { useState } from "react";
import { Link } from "react-router-dom";
import { useInstructorCourses, useDeleteCourse } from "../../hooks/useCourses";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaPercent,
  FaNewspaper,
} from "react-icons/fa";
import Button from "../../shared/components/Button";
import ConfirmModal from "../../shared/components/ConfirmModal";
import notification from "../../utils/notification";
import CoursesService from "../../services/CoursesService";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAuthStore from "../../Stores/authStore";

const DiscountModal = ({ isOpen, onClose, course, onSave, onRemove }) => {
  // ... (Logic for DiscountModal remains unchanged, I will use StartLine to target imports and component start)
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      discount: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await onSave(course._id, {
        discount: Number(data.discount),
        startDate: data.startDate,
        endDate: data.endDate,
      });
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm("Remove discount?")) return;
    setIsLoading(true);
    try {
      await onRemove(course._id);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-surface w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-6">
          <h3 className="heading-m text-text-main mb-4">Manage Discount</h3>
          <p className="text-sm text-text-muted mb-6">
            Set a discount for <strong>{course?.title}</strong>. Current Price:
            ${course?.price}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">
                Discount Percentage (%)
              </label>
              <input
                type="number"
                {...register("discount", { required: true, min: 1, max: 100 })}
                className="w-full p-2 border border-border rounded-lg bg-background"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  {...register("startDate", { required: true })}
                  className="w-full p-2 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  {...register("endDate", { required: true })}
                  className="w-full p-2 border border-border rounded-lg bg-background"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              {course?.isSale && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-error hover:bg-error/10 mr-auto"
                  onClick={handleRemove}
                  disabled={isLoading}
                >
                  Remove Sale
                </Button>
              )}

              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Save Discount
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const MyCoursesPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageCount = 10;
  const queryClient = useQueryClient();

  // Deletion Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    courseId: null,
    isLoading: false,
  });

  // Discount Modal State
  const [discountModal, setDiscountModal] = useState({
    isOpen: false,
    course: null,
  });

  const { user } = useAuthStore();
  const { data, isLoading } = useInstructorCourses(user?.id, {
    page,
    limit: pageCount,
  });
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();

  const courses = data?.courses || [];
  const totalPages = data?.totalPages || 1;

  const handleDelete = (id) => {
    setDeleteModal({
      isOpen: true,
      courseId: id,
      isLoading: false,
    });
  };

  const loops = [1, 2, 3, 4, 5];

  const confirmDelete = () => {
    setDeleteModal((prev) => ({ ...prev, isLoading: true }));
    deleteCourse(deleteModal.courseId, {
      onSuccess: () => {
        notification.success("Course deleted successfully!");
        setDeleteModal({ isOpen: false, courseId: null, isLoading: false });
      },
      onError: (error) => {
        notification.error(
          error?.response?.data?.message || "Failed to delete course."
        );
        setDeleteModal((prev) => ({ ...prev, isLoading: false }));
      },
    });
  };

  const handleOpenDiscount = (course) => {
    setDiscountModal({
      isOpen: true,
      course,
    });
  };

  const handleSaveDiscount = async (courseId, data) => {
    try {
      await CoursesService.addDiscount(courseId, data);
      notification.success("Discount updated successfully");
      queryClient.invalidateQueries(["courses"]); // Refresh list to show updated sale status
    } catch (error) {
      notification.error("Failed to update discount");
      throw error;
    }
  };

  const handleRemoveDiscount = async (courseId) => {
    try {
      await CoursesService.removeDiscount(courseId);
      notification.success("Discount removed successfully");
      queryClient.invalidateQueries(["courses"]);
    } catch (error) {
      notification.error("Failed to remove discount");
      throw error;
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
          className="bg-transparent border-none focus:ring-0 flex-1 text-text-main py-2 outline-none"
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
                loops.map((_, i) => (
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
                          {course.isSale && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-error/10 text-error text-[10px] font-bold uppercase rounded-sm border border-error/20">
                              Sale {course.discount}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {course.isSale ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-error">
                            ${course.salePrice}
                          </span>
                          <span className="text-xs text-text-muted line-through">
                            ${course.price}
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold text-primary">
                          ${course.price}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-600 hover:bg-purple-50"
                          onClick={() => handleOpenDiscount(course)}
                          title="Manage Discount"
                        >
                          <FaPercent />
                        </Button>

                        <Link to={`/dashboard/courses/${course._id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-info hover:bg-info/10"
                            title="Edit Course"
                          >
                            <FaEdit />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-error hover:bg-error/10"
                          onClick={() => handleDelete(course._id)}
                          title="Delete Course"
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

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Course"
        message="Are you sure you want to delete this course? All associated data will be permanently removed. This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        isLoading={deleteModal.isLoading || isDeleting}
      />

      {/* Discount Modal */}
      {discountModal.isOpen && (
        <DiscountModal
          isOpen={discountModal.isOpen}
          onClose={() => setDiscountModal({ isOpen: false, course: null })}
          course={discountModal.course}
          onSave={handleSaveDiscount}
          onRemove={handleRemoveDiscount}
        />
      )}
    </div>
  );
};

export default MyCoursesPage;
