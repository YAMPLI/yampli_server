const { User } = require('../models');
const jwt = require('jsonwebtoken');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  // 검증 미들웨어 생성 필요
  return await User.create(userBody);
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
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
 */

const createJWT = (userInfo) => {
  return jwt.sign(
    {
      userId: userInfo.id,
      userEmail: userInfo.userEmail,
      userNickname: userInfo.userNickname,
    },
    process.env.JWT_SECRET,
  );
};
module.exports = {
  createUser,
  getUserById,
  updateUserById,
  createJWT,
};
