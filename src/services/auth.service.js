const { extractQueryParams } = require('../api/middlewares/queryStringExtractor');
const redisClient = require('../config/redisClient');
const STRINGS = require('../constants/strings');
const { ForbiddenError, ConflictError } = require('../utils/errors');
const userService = require('../services/user.service');
const jwtService = require('../utils/jwt.util');

/**
 * 유저 이메일로 전송한 URL의 쿼리스트링 토큰 데이터 확인 후
 * 이메일 인증 상태로 변경
 * @param {String} url 이메일 인증 URL
 * @returns {Boolean}
 */
const authEmailTokenVerify = async (url) => {
  const queryParams = extractQueryParams(url).token;

  try {
    await redisClient.clientConnect();
    await redisClient.selectDataBase(0);
    const email = await redisClient.getData(queryParams);

    if (!email) {
      console.error(STRINGS.ALERT.NOT_VALID_PAGE_EXPIRE_TOKEN);
      throw new ForbiddenError(STRINGS.ALERT.NOT_VALID_PAGE_EXPIRE_TOKEN);
    }

    const user = await userService.findUserByEmail(email);
    if (!user && user.emailAuth) {
      console.error(STRINGS.ALERT.CHECK_SIGN_EMAIL);
      throw new ConflictError(STRINGS.ALERT.CHECK_SIGN_EMAIL);
    }
    user.emailAuth = true;
    await user.save();
    await redisClient.delData(queryParams);
  } finally {
    await redisClient.disconnect();
  }
};

const userLogin = async (payload) => {
  const { email, password } = payload;
  try {
    const user = await userService.findUserByEmail(email);
    console.log(user);
    if (user && (await user.isPasswordMatch(password))) {
      const { accessToken, refreshToken } = await jwtService.createToken(user);
      console.log('토큰 생성 완료');

      await redisClient.clientConnect();
      await redisClient.selectDataBase(1);
      await redisClient.setData(email, refreshToken);
      console.log('리프레쉬 토큰 저장 완료.');

      return accessToken;
    } else {
      throw new ConflictError('아이디/패스워드와 일치하는 사용자가 없습니다.\n 확인하시고 다시 시도해주세요.');
    }
  } catch (err) {
    throw err;
  } finally {
    // 레디스 클라이언트가 연결된 상태인지 확인
    if (redisClient.status === 'connect' || redisClient.status === 'ready') {
      console.log('레디스 연결 해제');
      await redisClient.disconnect();
    }
  }
};

module.exports = {
  authEmailTokenVerify,
  userLogin,
};
