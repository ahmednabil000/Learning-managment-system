const Comment = require("../models/courses/comment");
const Lecture = require("../models/courses/lecture");

module.exports.createComment = async (userId, commentData) => {
  const parentComment = await Comment.findById(commentData.parentComment);

  if (!parentComment && commentData.parentComment) {
    return { statusCode: 404, message: "Parent comment not found" };
  }
  const lecture = await Lecture.findById(commentData.lecture);
  if (!lecture) {
    return { statusCode: 404, message: "Lecture not found" };
  }
  return await Comment.create({
    ...commentData,
    user: userId,
    lecture: lecture._id,
  });
};

module.exports.getCommentById = async (id) => {
  const comment = await Comment.findOne({ _id: id }).lean();
  if (!comment) {
    return { statusCode: 404, message: "Comment not found" };
  }
  return comment;
};

module.exports.getLectureComments = async (lectureId, page, pageCount) => {
  const lecture = await Lecture.findById(lectureId);
  if (!lecture) {
    return { statusCode: 404, message: "Lecture not found" };
  }
  const comments = await Comment.find({
    lecture: lecture._id,
    parentComment: null,
  })
    .limit(pageCount)
    .skip((page - 1) * pageCount)
    .sort({ createdAt: -1 })
    .lean();

  await Promise.all(
    comments.map(async (comment) => {
      comment.replies = await Comment.find({ parentComment: comment._id })
        .sort({ createdAt: 1 })
        .lean();
    })
  );

  return comments;
};

module.exports.updateCommentById = async (userId, commentId, updateData) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return { statusCode: 404, message: "Comment not found" };
  }
  if (comment.user.toString() !== userId) {
    return {
      statusCode: 403,
      message: "You are not authorized to update this comment",
    };
  }
  return await Comment.findOneAndUpdate({ _id: commentId }, updateData, {
    new: true,
  });
};

module.exports.deleteCommentById = async (userId, commentId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return { statusCode: 404, message: "Comment not found" };
  }
  if (comment.user.toString() !== userId) {
    return {
      statusCode: 403,
      message: "You are not authorized to delete this comment",
    };
  }
  return await Comment.findOneAndDelete({ _id: commentId });
};
