const mongoose = require('mongoose');
const Song = require('./song.models.js');

const tagSchema = mongoose.Schema({
  title: { type: String, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Group' },
  song: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
});

tagSchema.pre('remove', async function (next) {
  const tagId = this._id;
  await Song.updateMany({ tags: tagId }, { $pull: { tags: tagId } });
  next();
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
