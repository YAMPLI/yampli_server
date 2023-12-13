const mongoose = require('mongoose');
// const { Like } = require('../models');
const Like = require('./like.model');

const replySchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }], // 대댓글
  createdAt: { type: Date, default: Date.now }, // 작성 시간을 저장하는 필드 추가
});

replySchema.pre('remove', async function (next) {
  // 연관된 좋아요 삭제
  await Like.deleteMany({ target: this._id, targetType: 'Reply' });

  // 대댓글의 대댓글 삭제 (재귀적으로 처리)
  for (const replyId of this.replies) {
    const subReply = await Reply.findById(replyId);
    if (subReply) {
      await subReply.remove();
    }
  }

  next();
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
