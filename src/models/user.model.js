const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  kakaoId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  nickname: { type: String, minLength: 1, maxLength: 100, required: true },
  activate: { type: Boolean, default: 1 },
  img: { type: String },
  role: { type: String, default: 'Normal' },
  group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  likedPlaylists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
