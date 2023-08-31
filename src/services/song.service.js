const { Song } = require('../models');

/**
 * Song 컬렉션 도큐먼트 생성
 * @param {Object} songInfo - db에 저장될 song 데이터
 * @returns {Promise}
 */
const createSong = async (songInfo) => {
  return await Song.create(songInfo);
};

/**
 *
 * @param {String} videoId - 유튜브 영상 videoId
 * @returns {Promise} - vidId가 중복된 song 데이터를 반환하는 promise 객체
 */
const findSongByVidId = async (videoId) => {
  return await Song.findOne({ vidId: videoId });
};

module.exports = { createSong, findSongByVidId };
