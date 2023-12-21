const { Comment, Like, Reply } = require('../models');

/**
 * Comment 및 연관 데이터 삭제
 * @param {String} commentId
 */
const deleteCommentAndRelatedData = async (commentId) => {
  await Like.deleteMany({ target: commentId, targetType: 'Comment' });
  await Reply.deleteMany({ parentComment: commentId }); // 대댓글 삭제
  await Comment.findOneAndDelete(commentId);
};

module.exports = {
  deleteCommentAndRelatedData,
};
