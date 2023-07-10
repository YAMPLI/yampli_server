const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, require: true, ref: 'User' },
  song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
  playlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
