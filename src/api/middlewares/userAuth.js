/**
 * 유저 로그인 후 클라이언트와 통신할 때 마다 헤더에 토큰을 담아와서 db에 저장된 유저 데이터와 비교한다.
 */

const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../../utils/errors');
const { userService } = require('../../services');

const userAuth = async (req, res, next) => {
  // 클라이언트에서 헤더에 유저 토큰을 담아온다
  try {
    const authHeader = req.headers.authorization;
    // 토큰 데이터가 오지 않거나 Bearer 문자열로 시작되는지 데이터가 없을 시 조건이 True가 되면서 에러를 던진다.
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      console.log('여기');
      throw new UnauthenticatedError('로그인이 필요합니다.');
    }
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);

    const user = await userService.getUserById(payload.userId);
    req.locals = user;
    next();
  } catch (error) {
    throw new UnauthenticatedError('로그인이 필요합니다.');
  }
};
module.exports = userAuth;
