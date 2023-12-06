const { Song } = require('../models');

/**
 * 새로운 노래 데이터 생성
 *
 * @param {Object} songInfo - 노래 정보가 저장될 객체
 * @returns {Promise}
 */
const createSong = async (songInfo) => {
  return await Song.create(songInfo);
};

/**
 *  주어진 비디오 ID를 사용하여 노래 검색
 *
 * @param {String} videoId - 유튜브 영상 videoId
 * @returns {Promise} - 중복된 vidId를 갖는 노래 데이터의 Promise
 */
const findSongByVidId = async (videoId) => {
  return await Song.findOne({ vidId: videoId });
};

module.exports = { createSong, findSongByVidId };
