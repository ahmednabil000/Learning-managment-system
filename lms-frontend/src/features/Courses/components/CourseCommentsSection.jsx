import React, { useState, useEffect, useCallback } from "react";
import { FaStar, FaUserCircle, FaTrash, FaEdit } from "react-icons/fa";
import CourseCommentsService from "../../../services/CourseCommentsService";
import useAuthStore from "../../../Stores/authStore";
import { formatDistanceToNow } from "date-fns";
import Button from "../../../shared/components/Button";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import { toast } from "react-toastify";

const StarRating = ({
  rating,
  setRating,
  interactive = false,
  size = "md",
}) => {
  const sizeClasses = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`${sizeClasses} ${
            interactive ? "cursor-pointer transition-colors" : ""
          } ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
          onClick={() => interactive && setRating(star)}
        />
      ))}
    </div>
  );
};

const CourseCommentsSection = ({ courseId }) => {
  const [comments, setComments] = useState([]);
  const [averageRate, setAverageRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit State
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useAuthStore();
  const currentUserId = user?.id || user?._id;

  const fetchData = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const [commentsData, rateData] = await Promise.all([
        CourseCommentsService.getCommentsByCourse(courseId, { limit: 100 }),
        CourseCommentsService.getCourseAverageRate(courseId),
      ]);
      setComments(commentsData.data || []);
      setAverageRate(rateData.averageRate || 0);
    } catch (error) {
      console.error("Failed to fetch course comments data", error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await CourseCommentsService.createComment({
        course: courseId,
        rate: newRating,
        content: newComment,
      });
      await fetchData();
      setNewComment("");
      setNewRating(5);
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Failed to submit comment", error);
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
    setEditRating(comment.rate);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
    setEditRating(5);
  };

  const handleUpdate = async () => {
    if (!editContent.trim()) return;

    setIsSubmitting(true);
    try {
      await CourseCommentsService.updateComment(editingCommentId, {
        content: editContent,
        rate: editRating,
      });
      await fetchData();
      handleCancelEdit();
      toast.success("Review updated successfully!");
    } catch (error) {
      console.error("Failed to update comment", error);
      toast.error(error.response?.data?.message || "Failed to update review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (commentId) => {
    setCommentToDelete(commentId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!commentToDelete) return;

    setIsDeleting(true);
    try {
      await CourseCommentsService.deleteComment(commentToDelete);
      await fetchData();
      toast.success("Review deleted successfully.");
      setIsDeleteModalOpen(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error("Failed to delete comment", error);
      toast.error(error.response?.data?.message || "Failed to delete review.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-text-muted">Loading reviews...</div>
    );
  }

  return (
    <>
      <div className="bg-surface rounded-2xl border border-border p-8 mt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-text-main">Course Reviews</h2>
          <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-100">
            <span className="text-2xl font-bold text-yellow-700">
              {averageRate.toFixed(1)}
            </span>
            <div className="flex flex-col">
              <StarRating rating={Math.round(averageRate)} />
              <span className="text-xs text-text-muted font-medium">
                Overall Rating
              </span>
            </div>
          </div>
        </div>

        {/* Add Review Form */}
        {user && !editingCommentId && (
          <form
            onSubmit={handleSubmit}
            className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-text-main mb-4">
              Leave a Review
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-muted mb-1">
                Rating
              </label>
              <StarRating
                rating={newRating}
                setRating={setNewRating}
                interactive
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-muted mb-1">
                Review
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience with this course..."
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all outline-none"
                rows="3"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                isLoading={isSubmitting}
              >
                Submit Review
              </Button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="border-b border-border last:border-0 pb-6 last:pb-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 mb-2">
                    <FaUserCircle className="w-10 h-10 text-gray-300" />
                    <div>
                      <p className="font-semibold text-text-main">
                        {comment.user?.name || "User"}
                      </p>
                      <p className="text-xs text-text-muted">
                        {comment.createdAt &&
                          formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {(comment.user?._id === currentUserId ||
                    comment.user === currentUserId) && (
                    <div className="flex items-center gap-3">
                      {editingCommentId !== comment._id && (
                        <>
                          <button
                            onClick={() => handleEditClick(comment)}
                            className="text-text-muted hover:text-primary transition-colors text-sm flex items-center gap-1"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(comment._id)}
                            className="text-text-muted hover:text-error transition-colors text-sm flex items-center gap-1"
                          >
                            <FaTrash /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {editingCommentId === comment._id ? (
                  // Edit Mode
                  <div className="bg-gray-50 p-4 rounded-lg mt-2 animate-in fade-in duration-200">
                    <div className="mb-3">
                      <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wide">
                        Update Rating
                      </label>
                      <StarRating
                        rating={editRating}
                        setRating={setEditRating}
                        interactive
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wide">
                        Update Review
                      </label>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-sm resize-none outline-none"
                        rows="3"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleUpdate}
                        isLoading={isSubmitting}
                        disabled={!editContent.trim()}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="mb-2">
                      <StarRating rating={comment.rate} size="sm" />
                    </div>
                    <p className="text-text-main leading-relaxed">
                      {comment.content}
                    </p>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-text-muted py-8">
              No reviews yet. Be the first to review this course!
            </p>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="error"
        isLoading={isDeleting}
      />
    </>
  );
};

export default CourseCommentsSection;
