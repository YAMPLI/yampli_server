const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType',
  },
  targetType: {
    type: String,
    required: true,
    enum: ['Group', 'Song', 'Playlist', 'Comment', 'Reply'],
  },
  createdAt: { type: Date, default: Date.now },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
