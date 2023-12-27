const { userService, authService } = require('../services');
const { sendResponse } = require('../utils/responses/responseHandler');
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
    const kakaoId = req.session.kakaoId;
    const data = {
      ...req.body,
      kakaoId,
    };

    const createUser = await userService.createUserEmail(data);

    // 세션 데이터 사용 후 삭제
    await delete req.session.kakaoId;
    sendResponse(res, StatusCodes.OK, {}, '가입이 완료되었습니다. 가입하신 메일을 확인하여 인증을 진행해주세요.');
  } catch (err) {
    throw err;
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
  createUserByEmail,
};
