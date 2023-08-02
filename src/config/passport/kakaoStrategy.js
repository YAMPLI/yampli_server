const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
require('dotenv').config();

const { User } = require('../../models');
const { log } = require('winston');
const clientURI = process.env.NGROK_URI;

// 모듈을 생성자 함수로 사용
// 카카오 로그인 인증 전략을 app.js에서 불러올 때 초기화한다.
// 함수와 파일 이름 같음 -> 꼭 기억하기(module.export = {))
module.exports = (callbackURL) => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID, // 카카오 로그인에서 발급받은 REST API 키
        // 카카오 로그인 Redirect URI 경로
        // callbackURL: 'http://localhost:3000/kakao/oauth',
        callbackURL: 'http://example1.local:8080/kakao/oauth',
        // callbackURL: `${clientURI}/kakao/oauth`,
        // callbackURL: process.env.NGROK_URI + '/kakao/oauth',
      },
      /*
       * clientID에 카카오 앱 아이디 추가
       * callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
       * accessToken, refreshToken: 로그인 성공 후 카카오가 보내준 토큰
       * profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입
       */
      async (accessToken, refreshToken, profile, done) => {
        try {
          // console.log(profile._json.kakao_account.email);
          // 카카오 플랫폼에서 로그인 했고 & snsId필드에 카카오 아이디가 일치할경우
          const exUser = await User.findOne({
            // User 모델에는 eamil 타입은 없고 userEamil이 존재
            // 자\꾸 User 모델에 없는 email을 비교하려고 하니까 그냥 findOne해서 최상위 데이터 가져오고있었음.
            id: profile._json.id,
          });
          // 이미 가입된 카카오 프로필이면 성공
          if (exUser) {
            done(null, exUser); // 로그인 인증 완료
          } else {
            // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
            const newUser = await User.create({
              kakaoId: profile.id,
              name: profile.username,
              email: profile._json && profile._json.kakao_account.email,
              nickname: profile.displayName,
              img: profile._json.properties.thumbnail_image,
            });
            done(null, newUser); // 회원가입하고 로그인 인증 완료
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      },
    ),
  );
};
