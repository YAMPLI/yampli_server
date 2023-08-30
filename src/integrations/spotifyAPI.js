const qs = require('qs');
const axios = require('axios');

const client_id = process.env.SPOTIFY_ID || '5cf3ec4d345d4783a93e023133186662';
const client_secret = process.env.SPOTIFY_KEY || 'd8882a82f10149cfb238e3308c6becac';

/**
 * 스포티파이 API를 사용하기 위한 토큰 발급 요청
 * @returns {object} access_token : 토큰정보 , duration : 유효시간
 */
const getSpotifyToken = async () => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify({ grant_type: 'client_credentials' }),
      {
        headers: {
          Authorization: 'Basic ' + new Buffer.from(client_id + ':' + client_secret).toString('base64'),
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error('스포티파이 서버 연결에 실패했습니다. 다시 시작해주세요.');
  }
};

const getSongBySpotify = async (artist, title, token) => {
  try {
    const query = `"${artist}" "${title}"`;
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
    if (response.data.tracks.items.length > 0) {
      // console.log(`===============${artist} : ${title}===================`);
      // console.log(response.data.tracks.items[0].album);
      return response.data.tracks.items[0];
    } else {
      return null;
    }
  } catch (error) {
    throw new Error('스포티파이 서버 연결에 실패했습니다. 다시 시작해주세요.');
  }
};

module.exports = {
  getSpotifyToken,
  getSongBySpotify,
};
