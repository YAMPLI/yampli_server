require('dotenv').config();
const qs = require('qs');
const axios = require('axios');

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_KEY;

/**
 * 스포티파이 API 토큰 발급 요청하는 함수
 *
 * @returns {Object} { access_token: 토큰 정보, duration: 유효 시간 }
 */
const fetchSpotifyToken = async () => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify({ grant_type: 'client_credentials' }),
      {
        headers: {
          Authorization: 'Basic ' + new Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'),
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error('스포티파이 서버 연결에 실패했습니다. 다시 시작해주세요.');
  }
};

/**
 * 스포타피이에서 노래 데이터를 가져오는 함수
 *
 * @param {String} artist - 가수 이름
 * @param {String} title - 노래 제목
 * @param {String} token - 스포티파이 토큰
 * @returns {Object|null} 노래 정보 객체 또는 null
 */
const getSongBySpotify = async (artist, title, token) => {
  try {
    const query = `"${artist}" "${title}"`;
    // limit : 출력할 결과의 갯수, 많아지면 정확도 떨어짐
    const params = {
      q: query,
      type: 'track',
      limit: 1,
    };
    const url = `https://api.spotify.com/v1/search?${qs.stringify(params)}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(url, { headers: headers });
    const items = response.data.tracks.items;

    return items.length > 0 ? items[0] : null;
  } catch (error) {
    throw new Error('스포티파이 서버 연결에 실패했습니다. 다시 시작해주세요.');
  }
};

module.exports = {
  fetchSpotifyToken,
  getSongBySpotify,
};
