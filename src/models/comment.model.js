const mongoose = require('mongoose');
const { Like, Reply } = require('../models');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // 현재 그룹의 ObjectId
  song: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
  }, // 노래에 직접 연결된 댓글을 나타내기 위한 필드
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
  createdAt: { type: Date, default: Date.now }, // 작성 시간을 저장하는 필드 추가
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlaylistSong',
  }, // 특정 플레이리스트 노래에 대한 댓글 조회하기 기능에 사용되는 필터링 로직을 구현하기 위한 필드
});

commentSchema.pre('remove', async function (next) {
  await Like.deleteMany({ target: this._id, targetType: 'Comment' });
  await Reply.deleteMany({ parentComment: this._id }); // 대댓글 삭제
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
