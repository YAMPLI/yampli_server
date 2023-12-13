const { User } = require('../models');
const jwt = require('jsonwebtoken');
const xlsx = require('xlsx');

/**
 * 설계 변경 후 쿼리
 */

const createNickname = () => {
  const ad = xlsx.readFile('../data/ad.xlsx');
  const animals = xlsx.readFile('../data/animals.xlsx');

  const sheetName1 = ad.SheetNames[0];
  const sheetName2 = animals.SheetNames[0];

  const sheet1 = ad.Sheets[sheetName1];
  const sheet2 = animals.Sheets[sheetName2];

  const data = xlsx.utils.sheet_to_json(sheet1);

  console.log(data);
};

/**
 *
 * @param {Object} userData
 * @returns {Promise<User>}
 */
const createUserEmail = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

/**
 * 설계 변경 전 쿼리 모음
 * (추후 삭제 혹은 수정)
 */
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
  createNickname,
};
