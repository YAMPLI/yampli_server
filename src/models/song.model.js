const mongoose = require('mongoose');
const { Comment, Like, PlaylistSong, TagUsage } = require('../models');

const songSchema = mongoose.Schema({
  vidId: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  thumb: [{ type: String, required: true }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

// 태그 사용 횟수 업데이트 함수
songSchema.methods.updateTagUsage = async function () {
  const song = this;

  // 현재 노래에 연결된 태그들을 가져옴
  const songTags = song.tags;

  // 각 태그에 대해 사용 횟수를 1씩 증가
  for (const tagId of songTags) {
    await TagUsage.findOneAndUpdate({ tag: tagId }, { $inc: { count: 1 } }, { upsert: true });
  }
};

songSchema.pre('remove', async function (next) {
  const songId = this._id;

  // 노래에 직접 달린 댓글과 PlaylistSong과 관련된 댓글 삭제
  await Comment.deleteMany({ song: songId });
  await Comment.deleteMany({ source: songId });

  // 노래와 관련된 좋아요 삭제
  await Like.deleteMany({ target: songId, targetType: 'Song' });

  // 연결된 PlaylistSong 삭제
  await PlaylistSong.deleteMany({ song: songId });

  // 태그 사용 횟수 업데이트
  const songTags = this.tags;
  for (const tagId of songTags) {
    await TagUsage.findOneAndUpdate({ tag: tagId }, { $inc: { count: -1 } }, { upsert: true });
  }

  next();
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
