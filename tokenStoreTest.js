require('dotenv').config({ path: '/yampli_server/.env' });
const qs = require('qs');
const axios = require('axios');

// spotify token get
// const client_id = process.env.SPOTIFY_ID;
// const client_secret = process.env.SPOTIFY_KEY;

const tokenStore = {
  token: null,
  expiryTime: null,
};

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

const setToken = (newToken, duration) => {
  const currentTime = new Date().getTime(); // 밀리초 단위로 현재 시간 가져온다
  const expiryTime = currentTime + duration * 1000; // 토큰 유효시간은 3600초(1시간)로 고정. 밀리 단위 사용 위해서 *1000
  tokenStore.token = newToken;
  tokenStore.expiryTime = expiryTime;
};

const getToken = () => {
  const currentTime = new Date().getTime();

  if (tokenStore.token && currentTime < tokenStore.expiryTime) {
    return tokenStore.token;
  }
  return null;
};

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
1;
async function callProtectedAPI() {
  const token = await getValidToken();
  return token;
}

module.exports = {
  callProtectedAPI,
  getValidToken,
};
