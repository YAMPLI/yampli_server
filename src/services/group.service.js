const { Group } = require('../models');

/**
    그룹 생성
 */
const createGroup = async (groupInfo) => {
  // 검증 미들웨어 생성 필요
  return await Group.create(groupInfo);
};

// 그룹, 그룹에 속한 유저 정보 반환
const findGroupUserInfo = async (userInfo) => {
  return await Group.find({ user: userInfo }).populate('joinUser');
};

const checkGroup = async (groupTitle, userId) => {
  return await Group.find({ title: groupTitle, user: { $in: userId } });
};

const findGroup = async (userInfo) => {
  return await Group.find({ userInfo });
};

module.exports = {
  createGroup,
  findGroupUserInfo,
  findGroup,
  checkGroup,
};
