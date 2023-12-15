const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  title: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
  user: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }],
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now }, // 작성 시간을 저장하는 필드 추가
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
