const { getSpotifyToken, getSongBySpotify } = require('../integrations/spotifyAPI');
// 스포티파이 토큰 저장
const tokenStore = {
  token: null,
  expiryTime: null,
};

/**
 * 메모리에 발급받은 토큰, 유효시간을 밀리초로 변환하여 저장.
 *
 * @param {string} newToken  스포티파이 access_token
 * @param {number} duration  토큰 유효시간
 */
const setToken = (newToken, duration) => {
  const currentTime = new Date().getTime(); // 밀리초 단위로 현재 시간 가져온다
  let newDuration = duration * 1000; // 토큰 유효시간은 3600초(1시간)로 고정되어 있다. 밀리 단위 사용 위해서 *1000
  const expiryTime = currentTime + newDuration;
  tokenStore.token = newToken;
  tokenStore.expiryTime = expiryTime;
};

/**
 * 토큰을 반환하는 함수.
 * 현재 시간과 토큰 유효시간을 비교하여 만료되지 않은 경우 토큰 반환
 * 현재 시간에 5분의 여유시간 추가
 * @returns {string|null} 유효시간 만료 전 : token, 만료 후 : null
 *
 */
const getToken = () => {
  const currentTime = new Date().getTime();

  if (tokenStore.token && currentTime + 300000 < tokenStore.expiryTime) {
    return tokenStore.token;
  }
  return null;
};

/**
 * getToken 함수를 통해서 유효시간을 체크하여 메모리에 저장된 토큰을 가져오거나
 * 토큰을 재발급 받는 함수.
 * @returns {string|null} getToken이 Null이 아닌경우 토큰 반환, null인 경우 토큰 재발급
 */
const getValidToken = async () => {
  const savedToken = getToken();
  if (savedToken) {
    return savedToken;
  } else {
    const newToken = await getSpotifyToken();
    setToken(newToken.access_token, newToken.expires_in);
    return newToken.access_token;
  }
};

/**
 * 메모리에 저장된 토큰 가져오는 함수
 * 유효 시간 만료를 확인하는 getValidToekn 메소드를 이용해서 가져온다
 * @returns {string}
 */
const callProtectedToken = async () => {
  const token = await getValidToken();
  return token;
};

/**
 * artist, title 검색 결과를 반환하는 함수
 * @param {string} artist
 * @param {string} title
 * @returns {Promise} 노래 정보를 갖고있는 promise 객체
 */
const getSong = async (artist, title) => {
  const token = await callProtectedToken();
  const song = await getSongBySpotify(artist, title, token);
  return song;
};

module.exports = {
  callProtectedToken,
  getValidToken,
  getSong,
};
