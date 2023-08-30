const { Playlist } = require('../models');
const createPlaylist = async (playlistInfo) => {
  // 검증 미들웨어 생성 필요
  return await Playlist.create(playlistInfo);
};

// 플레이리스트에 생성된 노래 추가
// const addSongToPlaylist = async (playlistId, songId) => {
//   return await Playlist.findByIdAndUpdate(
//     playlistId,
//     {
//       $push: { song: songId },
//     },
//     { new: true }, // 업데이트된 문서 반한
//   );
// };

/**
 * 플레이리스트에 song 추가
 * @param {String} playlistId - 플레이리스트 ID
 * @param {String} songId - 추가할 song의 ID
 * @returns {Promise} - 업데이트된 플레이리스트를 반환하는 promise 객체
 */
const addSongToPlaylist = async (playlistId, songId) => {
  return await Playlist.updateOne(
    { _id: { $in: playlistId } },
    {
      $push: { song: songId },
    },
    { new: true }, // 업데이트된 문서 반한
  );
};

// find -> 노래 정보 배열 , findOne -> 노래 정보 모두 출력
const findPlaylistSong = async (playlistInfo) => {
  return await Playlist.findOne({ _id: playlistInfo }).populate('song');
};

module.exports = {
  createPlaylist,
  findPlaylistSong,
  addSongToPlaylist,
};
