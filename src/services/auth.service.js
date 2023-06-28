// const axios = require('axios');
// require('dotenv').config();

// const kakaoLogin = async (kakaoBody) => {
//   const code = kakaoBody.query.code;
//   console.log('code : ' + code);

//   // 사용자 로그인 -> 인가코드수신 -> 토큰발급 -> 사용자 정보 확인
//   const authToken = await axios.post(
//     'https://kauth.kakao.com/oauth/token',
//     {},
//     {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       params: {
//         grant_type: 'authorization_code',
//         client_id: process.env.CLIENT_ID,
//         code,
//         redirect_uri: 'http://127.0.0.1:3306/api/auth/kakao/start',
//       },
//     },
//   );
//   return authToken;
// };

// module.exports = {
//   kakaoLogin,
// };
