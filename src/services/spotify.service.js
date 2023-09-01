const { fetchSpotifyToken, getSongBySpotify } = require('../integrations/spotifyAPI');

// 스포티파이 토큰 저장 객체
const spotifyTokenStore = {
  token: null,
  expiryTime: null,
};

/**
 * 토큰 및 유효시간을 저장하는 함수
 *
 * @param {string} newToken - 스포티파이 access_token
 * @param {number} duration - 토큰 유효시간 (초 단위)
 */
const saveSpotifyToken = (newToken, duration) => {
  const currentTime = new Date().getTime(); // 밀리초 단위로 현재 시간 가져온다
  let newDuration = duration * 1000; // 토큰 유효시간은 3600초(1시간)로 고정되어 있다. 밀리 단위 사용 위해서 *1000
  const expiryTime = currentTime + newDuration;
  spotifyTokenStore.token = newToken;
  spotifyTokenStore.expiryTime = expiryTime;
};

/**
 * 토큰을 가져오는 함수.
 *
 * @returns {string|null} 토큰이 유효하면 토큰 반환, 그렇지 않으면 null 반환
 */
const getSpotifyToken = () => {
  console.log('getSpotifyToken');
  const currentTime = new Date().getTime();
  //현재 시간에 5분의 여유시간 추가
  if (spotifyTokenStore.token && currentTime + 300000 < spotifyTokenStore.expiryTime) {
    return spotifyTokenStore.token;
  }
  return null;
};

/**
 * 유효한 토큰을 가져오거나 재발급하는 함수.
 *
 * @returns {string|null} 유효한 토큰이면 토큰 반환, 그렇지 않으면 재발급 후 토큰 반환
 */
const getValidSpotifyToken = async () => {
  console.log('getValidSpotifyToken');
  const savedToken = getSpotifyToken();
  if (savedToken) {
    return savedToken;
  } else {
    const newToken = await fetchSpotifyToken();
    saveSpotifyToken(newToken.access_token, newToken.expires_in);
    return newToken.access_token;
  }
};

/**
 * 아티스트와 제목을 기반으로 노래 정보를 가져오는 함수
 *
 * @param {string} artist - 아티스트 이름
 * @param {string} title - 노래 제목
 * @returns {Promise} 노래 정보를 포함하는 promise 객체
 */
const getSongInfo = async (artist, title) => {
  const token = await getValidSpotifyToken();
  console.log(token);
  const song = await getSongBySpotify(artist, title, token);
  console.log(song);
  return song;
};

module.exports = {
  getValidSpotifyToken,
  getSongInfo,
};
