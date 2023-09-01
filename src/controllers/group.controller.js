const { groupService, playlistService } = require('../services');
const { ConflictError } = require('../utils/errors');
const { StatusCodes } = require('http-status-codes');

/**
 * 새 그룹을 생성하는 함수
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
const createGroup = async (req, res) => {
  const user = req.locals;
  const groupTitle = req.body.title;

  if (!groupTitle) {
    throw new ConflictError('그룹 이름을 작성해주세요.');
  }
  const groupInfo = {
    title: groupTitle,
    user: user.id,
  };
  const findGroup = await groupService.findGroupByTitleAndUser(groupTitle, user.id);

  if (findGroup.length) {
    throw new ConflictError('같은 이름의 그룹이 존재합니다.');
  }

  const newGroup = await groupService.createGroup(groupInfo);

  const playlistTitle = groupTitle + ' 그룹 플레이리스트';
  const playListInfo = {
    title: playlistTitle,
    group: newGroup.id,
  };
  await playlistService.createPlaylist(playListInfo);

  res.status(StatusCodes.OK);
};

/**
 * 사용자의 그룹 목록을 가져오는 함수
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
const getGroup = async (req, res) => {
  const user = req.locals;
  const group = await groupService.findGroupByUser(user.id);
  res.status(StatusCodes.OK).json(group);
};

module.exports = {
  createGroup,
  getGroup,
};
