require('dotenv').config();
const axios = require('axios');
const logger = require('../config/logger');

/**
 * 클라이언트에게 전달받은 인가 코드를 사용하여 카카오 액세스 토큰 가져오기
 * @param {String} authCode - 카카오 인가 코드
 * @returns {String} 카카오 액세스 토큰
 */
const fetchKakaoToken = async (authCode) => {
  const functionName = 'fetchKakaoToken';
  try {
    logger.info(`starting ${functionName} in kakaoAPI`);
    const response = await axios({
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      headers: {
        'Content-type': 'application/json',
      },
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID,
        client_secret: 'yyamppli',
        code: authCode,
      },
    });
    return response.data.access_token;
  } catch (err) {
    throw new Error('카카오 인가코드를 가져오는데 실패했습니다.');
  }
};

/**
 * 액세스 토큰을 사용하여 카카오에 등록된 유저 정보 가져오기
 * @param {String} token - 액세스 토큰
 * @returns {Object} 카카오 유저 정보
 */
const fetchKakaoUserInfo = async (token) => {
  const functionName = 'fetchKakaoUserInfo';
  try {
    logger.info(`starting ${functionName} in kakaoAPI`);
    const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(`액세스 토큰을 사용하여 유저 정보를 가져오는데 실패했습니다.`);
  }
};

module.exports = {
  fetchKakaoToken,
  fetchKakaoUserInfo,
};
