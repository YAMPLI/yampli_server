const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  commentContent: { type: String, require: true },
  joinPlaylist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' },
  joinSong: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
  joinUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  commentParent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  commentDepth: { type: Number, default: 1 },
  commentIsDelete: { type: Boolean, default: 1 },
  commentCreateAt: { type: Date, default: Date.now },
  commentUpdateAt: { type: Date },
  playlistCreateAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
