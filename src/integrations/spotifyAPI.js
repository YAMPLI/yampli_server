const qs = require('qs');
const axios = require('axios');

const client_id = process.env.SPOTIFY_ID || '5cf3ec4d345d4783a93e023133186662';
const client_secret = process.env.SPOTIFY_KEY || 'd8882a82f10149cfb238e3308c6becac';

// 토큰 생성 및 갱신
const getSpotifyToken = async () => {
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
};

module.exports = {
  getSpotifyToken,
}; 
