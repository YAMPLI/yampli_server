const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
  songURL: { type: String, require: true },
  songTitle: { type: String, require: true },
  songArtist: { type: String, require: true },
  songPlaylist: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Playlist' }],
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
