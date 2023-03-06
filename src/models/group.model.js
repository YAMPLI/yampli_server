const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  groupName: { type: String, required: true },
  joinUser: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }],
  joinPlaylist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
