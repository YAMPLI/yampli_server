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

  await redisClient.disconnect();
};

module.exports = {
  authEmailTokenVerify,
};
