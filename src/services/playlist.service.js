const { Playlist } = require('../models');

const createPlaylist = async (playlistInfo) => {
  // 검증 미들웨어 생성 필요
  return await Playlist.create(playlistInfo);
};

// find -> 노래 정보 배열 , findOne -> 노래 정보 모두 출력
const findPlaylistSong = async (playlistInfo) => {
  return await Playlist.findOne({ id: playlistInfo }).populate('song');
};
module.exports = {
  createPlaylist,
  findPlaylistSong,
};
