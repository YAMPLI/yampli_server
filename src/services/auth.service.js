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
  const functionName = `authEmailTokenVerify`;
  const queryParams = extractQueryParams(url).token;

  logger.info(`starting ${functionName} in authService`);
  try {
    const email = await redisClient.getNamespacedData('0', queryParams);
    const user = await userService.findUserByEmail(email);

    // 레디스 데이터 유효시간 초과 혹은 유저 데이터 없는 경우 인증 코드 유효x 알림
    if (!email || !user) {
      logger.error(STRINGS.ALERT.NOT_VALID_PAGE_EXPIRE_TOKEN);
      throw new ForbiddenError(STRINGS.ALERT.NOT_VALID_PAGE_EXPIRE_TOKEN);
    }
    // 인증 완료된 데이터 존재 -> 이미 발송된 메일 무효화
    if (user && user.emailAuth) {
      logger.error(STRINGS.ALERT.CHECK_SIGN_EMAIL);
      throw new ConflictError(STRINGS.ALERT.CHECK_SIGN_EMAIL);
    }
    user.emailAuth = true;
    await user.save();
  } catch (err) {
    throw err;
  } finally {
    // 완료 시 , 만료된 링크 선택 시 레디스에 저장된 데이터 삭제
    await redisClient.delNamespacedData('0', queryParams);
  }
};

/**
 * 로그인 데이터를 사용하여 ATK, RTK 생성 후 클라이언트 전달 및 레디스 저장
 * @param {Object} payload -로그인 정보(email-password)
 * @returns {Object} JWT 토큰
 */
const userLogin = async (payload) => {
  const functionName = `userLogin`;
  const { email, password, kakaoId } = payload;
  logger.info(`starting ${functionName} in authService`);
  try {
    const user = await userService.findUserByEmail(email);
    if (!user.kakaoId && kakaoId) {
      // 카카오 아이디 연동
      user.kakaoId = kakaoId;
      await user.save();
      return { message: '기존 계정과 카카오 계정 연동에 성공했습니다. 다시 로그인 해주세요.' };
    }
    if (user && (await user.isPasswordMatch(password))) {
      const { accessToken, refreshToken } = await jwtService.createToken(user);
      await redisClient.setNamespacedData('0', email, refreshToken);
      return {accessToken};
    } else {
      logger.error(`아이디/패스워드와 일치하는 사용자가 없습니다.`);
      throw new ConflictError('아이디/패스워드와 일치하는 사용자가 없습니다.\n 확인하시고 다시 시도해주세요.');
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  authEmailTokenVerify,
  userLogin,
};
