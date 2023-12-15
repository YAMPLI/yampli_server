const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }], // 대댓글
  createdAt: { type: Date, default: Date.now }, // 작성 시간을 저장하는 필드 추가
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
