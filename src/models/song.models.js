const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
  vidId: { type: String, require: true },
  url: { type: String, require: true },
  title: { type: String, require: true },
  artist: { type: String, require: true },
  thumb: { type: String, require: true },
  playlist: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Playlist' }],
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
