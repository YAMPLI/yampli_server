const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  title: { type: String, require: true },
  group: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Group' },
  song: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
