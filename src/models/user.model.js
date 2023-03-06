const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true, lowercase: true, unique: true },
  userNickname: { type: String, minLength: 3, required: true, unique: true },
  userBirth: { type: String },
  userGender: { type: String },
  userActive: { type: Boolean, default: 1 },
  userImg: { type: String },
  userJoin: { type: Date, default: Date.now },
  userRole: { type: String, default: 'Normal' },
  joinGroup: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Group' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
