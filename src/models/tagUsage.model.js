const mongoose = require('mongoose');

const tagUsageSchema = new mongoose.Schema({
  tag: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: true },
  count: { type: Number, default: 0 },
});

const TagUsage = mongoose.model('TagUsage', tagUsageSchema);

module.exports = TagUsage;
