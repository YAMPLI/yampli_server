const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
  joinUser: { type: mongoose.Schema.Types.ObjectId, require: true, ref: 'User' },
  joinSong: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
  joinPlaylist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
