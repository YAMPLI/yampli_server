const userService = require('./user.service');
const authService = require('./auth.service');
const groupService = require('./group.service');
const playlistService = require('./playlist.service');
const songService = require('./song.service');
const spotifyService = require('./spotify.service');
const chatTextService = require('./chatTextProcessing.service');
module.exports = {
  userService,
  authService,
  groupService,
  playlistService,
  songService,
  spotifyService,
  chatTextService,
};
