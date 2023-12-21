const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema({
  title: { type: String, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Group' },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PlaylistSong' }], // songs 필드를 playlistSongSchema로 변경
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
