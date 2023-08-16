const userController = require('./user.controller');
const authController = require('./auth.controller');
const groupController = require('./group.controller');
const playlistController = require('./playlist.controller');
const socketTextProcessingController = require('./socketTextProcessing.controller');
module.exports = {
  userController,
  authController,
  groupController,
  playlistController,
  socketTextProcessingController,
};
