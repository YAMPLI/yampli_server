const { Group, Playlist, Comment, Like, User } = require('../models');

/**
 * 수정 후
 */

/**
 * 그룹 및 연관데이터 삭제
 * @param {String} groupId
 */
const deleteGroupAndRelatedData = async (groupId) => {
  await Playlist.find({ group: groupId }).then((playlists) => playlists.forEach((playlist) => playlist.remove()));
  await Comment.deleteMany({ group: groupId });
  await Like.deleteMany({ target: groupId, targetType: 'Group' });
  await User.updateMany({}, { $pull: { groups: groupId } });
  await Group.findOneAndDelete(groupId);
};

/**
 * 모델 수정 전
 */

/**
 * 새로운 그룹을 생성하는 함수
 *
 * @param {Object} groupInfo - 생성할 그룹 정보
 * @returns {Promise} 생성된 그룹의 promise
 */
const createGroup = async (groupInfo) => {
  // 검증 미들웨어 생성 필요
  return await Group.create(groupInfo);
};

/**
 * 유저 정보를 기반으로 그룹과 그룹에 속한 유저 정보를 반환하는 함수
 *
 * @param {String} userInfo - 유저 정보
 * @returns {Promise} 그룹과 그룹에 속한 유저 정보를 반환하는 Promise
 */
const findGroupByUserInfo = async (userInfo) => {
  return await Group.find({ user: userInfo }).populate('user');
};

/**
 * 그룹 제목과 유저 ID를 확인하여 그룹을 검사하는 함수
 *
 * @param {String} groupTitle - 그룹 제목
 * @param {String} userId - 유저 ID
 * @returns {Promise} 그룹을 검사하는 Promise
 */
const findGroupByTitleAndUser = async (groupTitle, userId) => {
  return await Group.find({ title: groupTitle, user: { $in: userId } });
};

/**
 * 유저 정보를 기반으로 해당 유저의 그룹 목록을 반환하는 함수
 *
 * @param {String} userId - 유저 정보
 * @returns {Promise} 해당 유저의 그룹 목록을 반환하는 Promise
 */
const findGroupByUser = async (userId) => {
  return await Group.find({ user: { $in: [userId] } });
};

/**
 * 그룹이 관리하는 플레이리스트를 반환하는 함수
 *
 * @param {String} groupId - 그룹 ID
 * @returns {Promise} 그룹이 관리하는 플레이리스트를 반환하는 Promise
 */
const findGroupPlaylist = async (groupId) => {
  return await Group.findById(groupId).populate('playlist');
};

/**
 * 노래를 플레이리스트에 추가하는 함수
 *
 * @param {String} groupId - 그룹 ID
 * @param {String} playlistId - 플레이리스트 ID
 * @returns {Promise} - 업데이트된 그룹을 반환하는 promise 객체
 */
const addPlaylistToGroup = async (groupId, playlistId) => {
  return await Group.updateOne(
    { _id: groupId },
    {
      $push: { playlist: playlistId },
    },
    { new: true }, // 업데이트된 문서 반한
  );
};
module.exports = {
  addPlaylistToGroup,
  createGroup,
  findGroupByUserInfo,
  findGroupByUser,
  findGroupByTitleAndUser,
  findGroupPlaylist,
  deleteGroupAndRelatedData,
};
