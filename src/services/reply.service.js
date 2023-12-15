const { Reply, Like } = require('../models');

const deleteReplyAndRelatedData = async (replyId) => {
  await Like.deleteMany({ target: replyId, targetType: 'Reply' });

  // 대댓글의 대댓글 삭제 (재귀적으로 처리)
  // replyId로 Reply 모델에서 find로 문서 가져와서
  // 해당 문서의 replies를 하나씩 꺼내와서 재귀적으로 처리하는 과정 추가 필요.
  // 아래 코드는 수정 전 (12/15)
  for (const replyId of this.replies) {
    const subReply = await Reply.findById(replyId);
    if (subReply) {
      await subReply.remove();
    }
  }

  await Reply.findOneAndDelete(replyId);
};

module.exports = {
  deleteReplyAndRelatedData,
};
