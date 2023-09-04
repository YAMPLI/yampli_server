const { Playlist } = require('../models');

/**
 * 새로운 플레이리스트을 생성하는 함수
 *
 * @param {Object} playlistInfo - 생성할 플레이리스트 정보
 * @returns {Promise} - 생성된 플레이리스트의 promise
 */
const createPlaylist = async (playlistInfo) => {
  // 검증 미들웨어 생성 필요
  return await Playlist.create(playlistInfo);
};

/**
 * 노래를 플레이리스트에 추가하는 함수
 *
 * @param {String} playlistId - 플레이리스트 ID
 * @param {String} songId - 추가할 노래의 ID
 * @returns {Promise} - 업데이트된 플레이리스트를 반환하는 promise 객체
 */
const addSongToPlaylist = async (playlistId, songId) => {
  return await Playlist.updateOne(
    { _id: { $in: playlistId } },
    {
      $push: { songs: songId },
    },
    { new: true }, // 업데이트된 문서 반한
  );
};

/**
 * 플레이리스트에 포함된 모든 노래를 반환하는 함수
 *
 * @param {String} playlistId - 플레이리스트 ID
 * @returns {Promise} 플레이리스트에 포함된 노래를 반환하는 promise 객체
 */
const findPlaylistSong = async (playlistId) => {
  return await Playlist.findOne({ id: playlistId }).populate('songs');
};

/**
 * 노래가 플레이리스트에 포함되어 있는지 확인하는 함수
 *
 * @param {String} playlistId - 플레이리스트 ID
 * @param {String} songId - 노래 ID
 * @returns {Promise} - 플레이리스트에 포함된 노래을 반환하는 promise 객체
 */
const findPlaylistWithSong = async (playlistId, songId) => {
  return await Playlist.findOne({ _id: playlistId, songs: songId });
};

module.exports = {
  createPlaylist,
  addSongToPlaylist,
  findPlaylistWithSong,
  findPlaylistSong,
};
