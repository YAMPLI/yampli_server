// const express = require('express');
// const { authController } = require('../../controllers');
// const router = express.Router();

// router.route('/kakao/start').get(authController.kakaoLogin);

// module.exports = router;

const express = require('express');
const { authController } = require('../../controllers');
const passport = require('passport');
const router = express.Router();

// router.route('/kakao/start').get(authController.kakaoLogin);
router.route('/kakao').get(passport.authenticate('kakao'));
router.route('/kakao/callback').get(passport.authenticate('kakao', { failureRedirect: '/' }), (req, res, next) => {
  res.route('/login');
});
// router.route('/test').get((req, res) => {
//   res.redirect('../../../login.html');
// });
// router.route('/kakao/callback').get((req, res, next) => {
//   passport.authenticate('kakao', { failureRedirect: '/' }, (err, user, info) => {
//     console.log('user ' + user);
//     // passport-kakao 전략 done 함수의 파라미터가 여기 콜백 함수의 인자로 전달된다.
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       const { provider, id } = info;
//       // 등록된 회원 정보가 없을 경우 info 파라미터에 전달된 사용자 정보를 이용해 세션을 생성한다.
//       req.session.joinUser = {
//         provider,
//         snsId: id,
//         email: info._json.kakao_account.email,
//         nickname: info._json.properties.nickname,
//         profile: info._json.properties.profile_image,
//       };
//       return req.session.save(() => {
//         // 세션이 생성되면 사용자를 회원가입 페이지로 리다이렉트 시킨다.
//         res.redirect(`${frontServer}/signup`);
//       });
//     }

//     // 회원가입된 상태일 경우, 로그인 세션을 생성한다.
//     return req.login(user, (error) => {
//       if (error) {
//         next(error);
//       }
//       res.redirect('/');
//     });
//   })(req, res, next); // 미들웨어 내의 미들웨어에는 호출 별도로 진행
// });

module.exports = router;
