const express = require('express');
const { authController } = require('../../controllers');
const passport = require('passport');
const router = express.Router();

// 로그인 여부 체크
router.route('/authcheck').get((req, res) => {
  const sendData = { isLogin: '' };
  if (req.session.is_loginsed) {
    sendData.isLogin = 'True';
  } else {
    sendData.isLogin = 'False';
  }
  res.send(sendData);
});

router.route('/kakao').get(passport.authenticate('kakao'), () => {
  console.log('/kakao');
});
router.route('/kakao/callback').get(passport.authenticate('kakao', { failureRedirect: '/api' }), (req, res) => {
  console.log(`req : ${res}`);
  res.redirect('http://localhost:3000/');
});

// router.route('/kakao/callback').get(
//   passport.authenticate('kakao', (authError, user, info) => {
//     console.log(authError);
//     console.log(user);
//     console.log(info);
//   }),
// );
module.exports = router;
