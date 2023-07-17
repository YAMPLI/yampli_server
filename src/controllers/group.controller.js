const { groupService, playlistService } = require('../services');
const { ConflictError } = require('../utils/errors');
const { StatusCodes } = require('http-status-codes');

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
  const findGroup = await groupService.checkGroup(groupTitle, user.id);

  if (findGroup.length) {
    throw new ConflictError('같은 이름의 그룹이 존재합니다.');
  }

  const newGroup = await groupService.createGroup(groupInfo);

  const playlistTitle = groupTitle + '그룹 플레이리스트';
  const playListInfo = {
    title: playlistTitle,
    group: newGroup.id,
  };
  await playlistService.createPlaylist(playListInfo);
  res.status(StatusCodes.OK);
};

const getGroup = async (req, res) => {
  const user = req.locals;
  const group = await groupService.findGroup(user.id);
  res.status(StatusCodes.OK).json(group);
};

module.exports = {
  createGroup,
  getGroup,
};
