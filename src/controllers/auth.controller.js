const { authService } = require('../services');
const { StatusCodes } = require('http-status-codes');
const { sendResponse } = require('../utils/responses/responseHandler');
const { userService } = require('../services');
const kakaoAPI = require('../integrations/kakaoAPI');
const kakaoStrategy1 = require('../config/passport/kakaoStrategy1');
const passport = require('passport');
const url = require('url');

const kakaoLoginCallback = async (req, res, next) => {
  // const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // 'x-forwarded-for' 요청이 거쳐온 각 프록시의 클라이언트 IP 주소를 모두 저장된다
  //  왼쪽부터 오른쪽으로 클라이언트와 가장 가까운 프록시의 IP를 나열하고 있으니, 제 클라이언트 IP는 목록의 첫 번째 IP
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;
  const callbackUrl =
    clientIp === '127.0.0.1'
      ? 'http://example1.local:8080/kakao/oauth'
      : 'https://43bf-106-241-78-77.ngrok-free.app/kakao/oauth';
  // 카카오 통신 테스트 주석[1]
  // const authCode = url.parse(req.url, true).query['code'];
  // console.log(authCode);

  // 주석 해제 불필요
  // const body = qs.stringify({
  //   grant_type: 'authorization_code', //특정 스트링
  //   client_id: 'c5b1ee02e2f3b25b84c8eb9cf4fb34d0',
  //   client_secret: 'yyamppli',
  //   redirectUri: 'http://example1.local:8080/kakao/oauth',
  //   code: authCode,
  // });

  // 카카오 토큰 유저 데이터 요청[2]
  // await axios({
  //   method: 'POST',
  //   url: 'https://kauth.kakao.com/oauth/token',
  //   headers: {
  //     'Content-type': 'application/json',
  //   },
  //   params: {
  //     grant_type: 'authorization_code', //특정 스트링
  //     client_id: 'c5b1ee02e2f3b25b84c8eb9cf4fb34d0',
  //     client_secret: 'yyamppli',
  //     redirectUri: 'http://example1.local:8080/kakao/oauth',
  //     code: authCode,
  //   },
  // }).then(async (res) => {
  //   const token = res.data.access_token;
  //   const result = await axios
  //     .get('https://kapi.kakao.com/v2/user/me', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res.data);
  //     });
  // });

  // 파라미터 테스트 주석해제 불필요
  // console.log(getToken);
  // const getKakaoToken = await axios.post(
  //   'https://kauth.kakao.com/oauth/token',
  //   {},
  //   {
  //     headers: {
  //       'Content-type': 'application/json',
  //     },
  //     params: {
  //       grant_type: 'authorization_code', //특정 스트링
  //       client_id: 'c5b1ee02e2f3b25b84c8eb9cf4fb34d0',
  //       client_secret: 'yyamppli',
  //       redirectUri: 'http://example1.local:8080/kakao/oauth',
  //       code: authCode,
  //     },
  //   },
  // );
  // console.log(getKakaoToken);

  // 기존 패스포트 방식
  const kakaoStrategy11 = kakaoStrategy1(callbackUrl);
  passport.use(kakaoStrategy11);
  passport.authenticate('kakao', { failureRedirect: '/' }, async (err, user) => {
    if (err) return next(err);
    const userId = user._id;
    const userInfo = await userService.getUserById(userId);
    const token = await userService.createJWT(userInfo);

    res.cookie('refe', token, { httpOnly: true }).status(StatusCodes.OK).json({ token });
  })(req, res, next);

  // const getToken = async();
  // const signInKakao = async (kakaoToken) => {
  //   const result = await axios.get('https://kapi.kakao.com/v2/user/me', {
  //     headers: {
  //       Authorization: `Bearer ${kakaoToken}`,
  //     },
  //   });
  //   const { data } = result;
  //   const name = data.properties.nickname;
  //   const email = data.kakao_account.email;
  //   const kakaoId = data.id;
  //   const profileImage = data.properties.profile_image;

  //   if (!name || !email || !kakaoId) throw new error('KEY_ERROR', 400);

  //   const user = await userDao.getUserById(kakaoId);

  //   if (!user) {
  //     await userDao.signUp(email, name, kakaoId, profileImage);
  //   }

  //   return jwt.sign({ kakao_id: user[0].kakao_id }, process.env.TOKKENSECRET);
  // };
};

const kakaoGetData = async (req, res) => {
  const authCode = url.parse(req.url, true).query['code'];
  console.log(`카카오 인가코드 : ${authCode}`);

  try {
    const kakaoToken = await kakaoAPI.fetchKakaoToken(authCode);
    const user = await kakaoAPI.fetchKakaoUserInfo(kakaoToken);
    const userInfo = await userService.findUserByKakao(user.id);

    // 유저 정보가 존재하지 않는 경우
    if (!userInfo) {
      req.session.kakaoId = user.id;
      sendResponse(
        res,
        StatusCodes.MOVED_PERMANENTLY,
        { url: '/login' },
        `카카오 계정 연동을 위해 가입하신 메일로 로그인 해주세요. \n 만약 처음이시라면 이메일 회원가입 후 이용해주세요.`,
      );
    }
  } catch (err) {
    throw err;
  }
};

/**
 * 유저 이메일 인증 상태 변경
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
const authEmail = async (req, res) => {
  try {
    const token = req.body['token'];
    const params = await authService.authEmailTokenVerify(token);
    sendResponse(res, StatusCodes.OK, {}, '이메일 인증에 성공했습니다.');
  } catch (err) {
    throw err;
  }
};

/**
 * 로그인 처리 후 생성된 ATK 클라이언트 전달
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
const loginByEmail = async (req, res) => {
  try {
    const kakaoId = req.session.kakaoId;
    const data = {
      ...req.body,
      kakaoId,
    };
    const result = await authService.userLogin(data);
    if (result.accessToken) {
      sendResponse(res, StatusCodes.OK, { token: result.accessToken }, '로그인 성공');
    } else {
      sendResponse(res, StatusCodes.MOVED_PERMANENTLY, { url: '/login' }, result.message);
    }
    await delete rea.session.kakaoId;
  } catch (err) {
    throw err;
  }
};
module.exports = {
  kakaoLoginCallback,
  authEmail,
  loginByEmail,
  kakaoGetData,
};
