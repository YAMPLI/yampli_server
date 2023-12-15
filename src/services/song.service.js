const { Song, Comment, Like, PlaylistSong, TagUsage } = require('../models');

/**
 * 수정 후
 */
const deleteSongAndRelatedData = async (songId) => {
  // 노래에 직접 달린 댓글과 PlaylistSong과 관련된 댓글 삭제
  await Comment.deleteMany({ song: songId });
  await Comment.deleteMany({ source: songId });

  // 노래와 관련된 좋아요 삭제
  await Like.deleteMany({ target: songId, targetType: 'Song' });

  // 연결된 PlaylistSong 삭제
  await PlaylistSong.deleteMany({ song: songId });

  // 태그 사용 횟수 업데이트
  // 잘 되는지 확인 필요 (12.15)
  await Song.findById(songId).then(async (songs) => {
    const songTags = songs.tags;
    for (const tagId of songTags) {
      await TagUsage.findOneAndUpdate({ tag: tagId }, { $inc: { count: -1 } }, { upsert: true });
    }
  });
  await Song.findOneAndDelete(songId);
};

/**
 * 모델 수정 전
 */

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
