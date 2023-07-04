const passport = require('passport');
const kakaoPassport = require('./kakaoStrategy');
const { User } = require('../../models/index');

module.exports = () => {
  // strategy에서 로그인 성공시 호출하는 done(null, user) 함수의 두 번째 인자 user를 전달 받아
  // 세션(req.session.passport.user)에 저장
  // 보통 세션의 무게를 줄이기 위해, user의 id만 세션에 저장

  passport.serializeUser((user, done) => {
    console.log('serializeUser  : ' + user);
    done(null, user.id);
  });

  // 서버로 들어오는 요청마다 세션정보를 실제 DB와 비교
  // 해당 유저 정보가 있으면 done을 통해 req.user에 저장
  // serializeUser에서 done으로 넘겨주는 user가 deserializeUser의 첫 번째 매개변수로 전달되기 때문에 둘의 타입은 항상 일치 필요
  passport.deserializeUser(async (id, done) => {
    console.log('deserializeUser');
    User.findById(id)
      .then((user) => {
        done(null, user);
        console.log('deserializeUser check');
      })
      .catch((err) => done(err));
  });
  // KakaoStrategy 미들웨어 사용
  kakaoPassport();
};
