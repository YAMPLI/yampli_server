const { User } = require('../models');
const jwt = require('jsonwebtoken');

/**
 * 사용자 생성
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  // 검증 미들웨어 생성 필요
  return await User.create(userBody);
};

/**
 * ID로 사용자 조회
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return await User.findById(id);
};

/**
 * ID로 사용자 업데이트
 * @param {String} userId
 * @param {Object} userData
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, userData) => {
  const user = await getUserById(userId);
  Object.assign(user, userData);
  await user.save();
  return user;
};

/**
 * JWT 생성
 * @param {Object} userInfo
 * @returns {string} 생성된 JWT 토큰
 */
const createJWT = (userInfo) => {
  return jwt.sign(
    {
      userId: userInfo.id,
      userEmail: userInfo.userEmail,
      userNickname: userInfo.uerNickname,
    },
    process.env.JWT_SECRET,
  );
};

/**
 * 사용자의 그룹 조회
 * @param {String} userId
 * @returns {Promise<User[]>}
 */
const findUserGroup = async (userInfo) => {
  return User.find({ userId: userInfo }).populate('groups').exec();
};

module.exports = {
  createUser,
  getUserById,
  updateUserById,
  createJWT,
  findUserGroup,
};
