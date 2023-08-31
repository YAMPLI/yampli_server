const mongoose = require('mongoose');
const { Playlist, Comment } = require('../models');

const groupSchema = mongoose.Schema({
  title: { type: String, required: true },
  user: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }],
  playlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
});

groupSchema.pre('remove', async function (next) {
  await Playlist.deleteMany({ group: this._id });
  await Comment.deleteMany({ group: this._id });
  next();
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
