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

router.route('/kakao/oauth').get(passport.authenticate('kakao', { failureRedirect: '/api' }), (req, res) => {
  console.log(`req : ${res}`);
  res.status(200).json({ token: 'to' });
});

module.exports = router;
