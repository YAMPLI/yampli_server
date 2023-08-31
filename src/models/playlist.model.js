const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema({
  title: { type: String, require: true },
  group: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Group' },
  song: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  isPublic: { type: Boolean, default: false }, // 전체 공개 여부
  createAt: { type: Date, default: Date.now },
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
