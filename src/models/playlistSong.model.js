const mongoose = require('mongoose');

const playlistSongSchema = mongoose.Schema({
  song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  playlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }, // 이 부분이 추가됨
});

const PlaylistSong = mongoose.model('PlaylistSong', playlistSongSchema);

module.exports = PlaylistSong;
