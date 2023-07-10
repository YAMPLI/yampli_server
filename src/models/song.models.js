const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
  url: { type: String, require: true },
  title: { type: String, require: true },
  artist: { type: String, require: true },
  playlist: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Playlist' }],
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
