const mongoose = require('mongoose');
// const { Comment, Like, PlaylistSong, TagUsage } = require('../models');
const Comment = require('./comment.model');
const Like = require('./like.model');
const PlaylistSong = require('./playlistSong.model');
const TagUsage = require('./tagUsage.model');

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

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
