const { extractQueryParams } = require('../api/middlewares/queryStringExtractor');
const redisClient = require('../config/redisClient');
const STRINGS = require('../constants/strings');
const { ForbiddenError, ConflictError } = require('../utils/errors');
const userService = require('./user.service');

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
    const authStatus = await userService.emailAuthCheck(user);

    if (!authStatus) {
      user.emailAuth = !user.emailAuth;
      const userUpdate = await user.save();
      if (userUpdate) {
        await redisClient.delData(queryParams);
        return true;
      }
    } else {
      console.error(STRINGS.ALERT.CHECK_SIGN_EMAIL);
      throw new ConflictError(STRINGS.ALERT.CHECK_SIGN_EMAIL);
    }
  } catch (err) {
    throw err;
  } finally {
    await redisClient.disconnect();
  }
};

module.exports = {
  authEmailTokenVerify,
};
