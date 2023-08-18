const qs = require('qs');
const axios = require('axios');

// spotify token get
var client_id = '5cf3ec4d345d4783a93e023133186662';
var client_secret = 'd8882a82f10149cfb238e3308c6becac';

const getAccessToken = async () => {
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
