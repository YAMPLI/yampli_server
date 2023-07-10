const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  content: { type: String, require: true },
  playlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' },
  song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  depth: { type: Number, default: 1 },
  isDelete: { type: Boolean, default: 1 },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
