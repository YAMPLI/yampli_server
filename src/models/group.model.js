const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  title: { type: String, required: true },
  user: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }],
  playlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
