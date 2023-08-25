const { getSpotifyToken } = require('../integrations/spotifyAPI');

const tokenStore = {
  token: null,
  expiryTime: null,
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
