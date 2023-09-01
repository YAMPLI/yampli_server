const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../../utils/errors');
const { userService } = require('../../services');

/**
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - 다음 미들웨어 함수 호출 함수
 */
const userAuth = async (req, res, next) => {
  // 클라이언트에서 헤더에 유저 토큰을 담아온다
  try {
    const authHeader = req.headers.authorization;

    // 토큰 데이터가 오지 않거나 Bearer 문자열로 시작되는지 데이터가 없을 시 에러 던짐
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new UnauthenticatedError('로그인이 필요합니다.');
    }

    // 토큰 분리하고 검증
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 토큰에 담긴 유저 아이디로 유저 정보를 조회해서 req.locals에 저장
    const user = await userService.getUserById(payload.userId);
    req.locals = user;

    next();
  } catch (error) {
    throw new UnauthenticatedError('로그인이 필요합니다.');
  }
};
module.exports = userAuth;
