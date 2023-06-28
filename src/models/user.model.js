const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true, lowercase: true, unique: true },
  userNickname: { type: String, minLength: 1, maxLength: 100, required: true },
  userActive: { type: Boolean, default: 1 },
  userImg: { type: String },
  userRole: { type: String, default: 'Normal' },
  joinGroup: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
