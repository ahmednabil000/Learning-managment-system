import React, { useState, useEffect, useCallback } from "react";
import {
  FaPaperPlane,
  FaReply,
  FaTrash,
  FaEdit,
  FaUserCircle,
} from "react-icons/fa";
import CommentsService from "../../../services/CommentsService";
import useAuthStore from "../../../Stores/authStore";
import { formatDistanceToNow } from "date-fns";

const CommentItem = ({
  comment,
  lectureId,
  onReply,
  onEdit,
  onDelete,
  currentUserId,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner =
    comment.user === currentUserId || comment.user?._id === currentUserId;
  const authorName = comment.user?.name || comment.user?.email || "User"; // Fallback if populated
  // If user is just ID string, we might just show "User" or truncated ID.
  // Assuming API might populate, if not we handle it gracefully.
  const displayName = typeof comment.user === "string" ? "User" : authorName;

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setIsSubmitting(true);
    try {
      await onReply(comment._id, replyContent);
      setIsReplying(false);
      setReplyContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    setIsSubmitting(true);
    try {
      await onEdit(comment._id, editContent);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex gap-3 mb-4 last:mb-0">
      <div className="shrink-0">
        <FaUserCircle className="w-8 h-8 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-gray-900 text-sm">
              {displayName}
            </span>
            <span className="text-xs text-gray-500">
              {comment.createdAt &&
                formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
            </span>
          </div>

          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                rows="2"
              />
              <div className="mt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1 bg-primary text-white text-xs rounded-md hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-700 text-sm whitespace-pre-wrap">
              {comment.content}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 mt-1 ml-1">
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="text-xs text-gray-500 hover:text-primary flex items-center gap-1 font-medium"
          >
            <FaReply /> Reply
          </button>

          {isOwner && (
            <>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 font-medium"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => onDelete(comment._id)}
                className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 font-medium"
              >
                <FaTrash /> Delete
              </button>
            </>
          )}
        </div>

        {isReplying && (
          <form onSubmit={handleReplySubmit} className="mt-3">
            <div className="flex gap-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                rows="2"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-end p-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
          </form>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 ml-2 pl-4 border-l-2 border-gray-100">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                lectureId={lectureId}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentsSection = ({ lectureId }) => {
  // const { t } = useTranslation(); // Unused
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();
  const currentUserId = user?.id || user?._id; // Adjust based on token structure

  const fetchComments = useCallback(async () => {
    if (!lectureId) return;
    setLoading(true);
    try {
      const data = await CommentsService.getLectureComments(lectureId);
      // Assuming data is array of comments. API doc says array.
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  }, [lectureId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      const data = {
        content: newComment,
        lecture: lectureId,
        parentComment: null,
      };
      await CommentsService.createComment(data);
      // Ideally re-fetch or optimistically add. Re-fetching ensures structure is correct.
      // But creating a comment returns the comment object.
      // If we re-fetch, we get everything incl replies.
      await fetchComments();
      setNewComment("");
    } catch (error) {
      console.error("Failed to create comment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentCommentId, content) => {
    try {
      const data = {
        content,
        lecture: lectureId,
        parentComment: parentCommentId,
      };
      await CommentsService.createComment(data);
      await fetchComments();
    } catch (error) {
      console.error("Failed to reply", error);
      throw error;
    }
  };

  const handleEdit = async (commentId, content) => {
    try {
      await CommentsService.updateComment(commentId, { content });
      await fetchComments();
    } catch (error) {
      console.error("Failed to update comment", error);
      throw error;
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      await CommentsService.deleteComment(commentId);
      await fetchComments();
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  if (!lectureId) return null;

  return (
    <div className="bg-white rounded-lg p-6 mt-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
        {/* Note: comments.length counts top level. Maybe we need total count? */}
      </h3>

      {/* New Comment Input */}
      <div className="flex gap-3 mb-8">
        <div className="shrink-0">
          <FaUserCircle className="w-10 h-10 text-gray-300" />
        </div>
        <form onSubmit={handleCreateComment} className="flex-1">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-4 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
              rows="3"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="absolute bottom-3 right-3 p-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              lectureId={lectureId}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No comments yet. Be the first to start the discussion!
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
