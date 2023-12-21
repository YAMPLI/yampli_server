const { userService, authService } = require('../services');
const { StatusCodes } = require('http-status-codes');

/**
 * 설계 변경 후 컨트롤러
 */

/**
 * Email 계정 생성
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
const createUserByEmail = async (req, res) => {
  try {
    const createUser = await userService.createUserEmail(req.body);
    res.status(StatusCodes.OK).json({ data: true, message: '' });
  } catch (err) {
    throw err;
  }
};
const createNickname = async (req, res) => {
  try {
    const nickname = await userService.createNickname();
    res.json({ data: nickname });
  } catch (err) {
    console.log();
  }
};

const deleteUser = async (req, res) => {
  try {
  } catch (err) {}
};

/**
 * 설계 변경 전 컨트롤러
 *
 */
/**
 * 새로운 사용자 생성하는 함수
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.json({ data: user, status: 'success' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * 사용자 정보 가져오는 함수
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
const getUsers = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    res.json({ data: user, status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 사용자 정보 업데이트하는 함수
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userData = req.body;
    const user = userService.updateUserById(userId, userData);
    res.send(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createUser,
  getUsers,
  updateUser,
  createNickname,
  createUserByEmail,
};
