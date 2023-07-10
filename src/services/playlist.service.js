const { Playlist } = require('../models');

const createPlaylist = async (playlistInfo) => {
  // 검증 미들웨어 생성 필요
  return await Playlist.create(playlistInfo);
};
module.exports = {
  createPlaylist,
};
