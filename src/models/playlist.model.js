const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema({
  playlistName: { type: String, require: true },
  joinGroup: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Group' },
  joinSong: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  playlistCreateAt: { type: Date, default: Date.now },
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
