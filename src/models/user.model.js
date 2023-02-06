const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  permissionLevel: Number,
});

const User = mongoose.model('Users', userSchema);

module.exports = User;
