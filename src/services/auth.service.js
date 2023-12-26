const { extractQueryParams } = require('../api/middlewares/queryStringExtractor');
const redisClient = require('../config/redisClient');
const STRINGS = require('../constants/strings');
const { ForbiddenError, ConflictError } = require('../utils/errors');
const userService = require('../services/user.service');
const jwtService = require('../utils/jwt.util');
const logger = require('../config/logger');
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

/**
 * 로그인 데이터를 사용하여 ATK, RTK 생성 후 클라이언트 전달 및 레디스 저장
 * @param {Object} payload -로그인 정보(email-password)
 * @returns {Object} JWT 토큰
 */
const userLogin = async (payload) => {
  const { email, password } = payload;
  try {
    const user = await userService.findUserByEmail(email);
    if (user && (await user.isPasswordMatch(password))) {
      const { accessToken, refreshToken } = await jwtService.createToken(user);

      await redisClient.clientConnect();
      await redisClient.selectDataBase(1);
      await redisClient.setData(email, refreshToken);

      return accessToken;
    } else {
      throw new ConflictError('아이디/패스워드와 일치하는 사용자가 없습니다.\n 확인하시고 다시 시도해주세요.');
    }
  } catch (err) {
    throw err;
  } finally {
    await redisClient.disconnect();
  }
};

module.exports = {
  authEmailTokenVerify,
  userLogin,
};
