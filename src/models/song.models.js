const mongoose = require('mongoose');
const { Playlist, Comment } = require('../models');

const songSchema = mongoose.Schema({
  vidId: { type: String, require: true, unique: true },
  url: { type: String, require: true },
  title: { type: String, require: true },
  artist: { type: String, require: true },
  thumb: [{ type: String, require: true }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  playlist: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Playlist' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

// 미들웨어 추가
songSchema.pre('remove', async function (next) {
  // this는 삭제되는 song 도큐먼트를 참조
  const songId = this._id;

  // 모든 플레이리스트에서 해당 song._id 참조를 삭제합니다.
  await Playlist.updateMany({ song: songId }, { $pull: { song: songId } });
  // 노래에 달린 댓글 삭제
  await Comment.deleteMany({ song: songId });
  next();
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
