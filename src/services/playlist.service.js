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

/**
 * 플레이리스트에 song이 포함되어 있는지 확인하기 위한 함수
 * @param {String} playlistId - 플레이리스트 ID
 * @param {String} songId - 노래 ID
 * @returns {Promise} - 플레이리스트에 포함된 song을 반환하는 promise 객체
 */
const findPlaylistWithSong = async (playlistId, songId) => {
  return await Playlist.findOne({ _id: playlistId, song: songId });
};

module.exports = {
  createPlaylist,
  addSongToPlaylist,
  findPlaylistWithSong,
};
