const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  tagName: { type: String, require: true },
  joinGroup: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Group' },
  joinSong: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
