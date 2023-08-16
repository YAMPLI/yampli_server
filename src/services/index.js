const userService = require('./user.service');
const authService = require('./auth.service');
const groupService = require('./group.service');
const playlistService = require('./playlist.service');
const socketTextProcessing = require('./socketTextProcessing.service');
module.exports = {
  userService,
  authService,
  groupService,
  playlistService,
  socketTextProcessing,
};
