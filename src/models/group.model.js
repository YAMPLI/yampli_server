const mongoose = require('mongoose');
// const { Playlist, Comment, Like, User } = require('../models');
const Playlist = require('./playlist.model');
const Comment = require('./comment.model');
const Like = require('./like.model');
const User = require('./user.model');

const groupSchema = mongoose.Schema({
  title: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
  user: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }],
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now }, // 작성 시간을 저장하는 필드 추가
});

groupSchema.pre('remove', async function (next) {
  const groupId = this._id;
  await Playlist.find({ group: groupId }).then((playlists) => playlists.forEach((playlist) => playlist.remove()));
  await Comment.deleteMany({ group: groupId });
  await Like.deleteMany({ target: groupId, targetType: 'Group' });
  await User.updateMany({}, { $pull: { groups: groupId } });
  next();
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
