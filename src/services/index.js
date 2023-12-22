const userService = require('./user.service');
const authService = require('./auth.service');
const groupService = require('./group.service');
const playlistService = require('./playlist.service');
const playlistSongService = require('./playlistSong.service');
const songService = require('./song.service');
const commentService = require('./comment.service');
const replyService = require('./reply.service');
const spotifyService = require('./spotify.service');
const chatTextService = require('./chatTextProcessing.service');

module.exports = {
  userService,
  authService,
  groupService,
  playlistService,
  songService,
  commentService,
  replyService,
  spotifyService,
  chatTextService,
  playlistSongService,
};
