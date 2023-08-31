const qs = require('qs');
const axios = require('axios');

const client_id = process.env.SPOTIFY_ID;
const client_secret = process.env.SPOTIFY_KEY;

/**
 * 스포티파이 API를 사용하기 위한 토큰 발급 요청
 * @returns {object} { access_token: 토큰 정보, duration: 유효 시간 }
 */
const getSpotifyToken = async () => {
  try {
    const authHeader = 'Basic' + Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify({ grant_type: 'client_credentials' }),
      {
        headers: {
          Authorization: authHeader,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error('스포티파이 서버 연결에 실패했습니다. 다시 시작해주세요.');
  }
};

/**
 * 스포타피이에 저장된 노래 데이터 가져오기
 *
 * @param {String} artist - 가수이름
 * @param {String} title - 노래제목
 * @param {String} token - 스포티파이 토큰
 * @returns {Object|null}
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
  getSpotifyToken,
  getSongBySpotify,
};
