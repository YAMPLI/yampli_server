const mongoose = require('mongoose');
const { Comment, Like, Playlist } = require('../models');

const playlistSongSchema = mongoose.Schema({
  song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  playlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }, // 이 부분이 추가됨
});

playlistSongSchema.pre('remove', async function (next) {
  const playlistSongId = this._id;
  await Comment.deleteMany({ source: this._id });
  await Like.deleteMany({ target: this._id, targetType: 'PlaylistSong' });
  // 플레이리스트 데이터 삭제
  await Playlist.updateMany({}, { $pull: { playlists: playlistSongId } });
  next();
});

const PlaylistSong = mongoose.model('PlaylistSong', playlistSongSchema);

module.exports = PlaylistSong;
