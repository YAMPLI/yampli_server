const express = require('express');
const { authController } = require('../../controllers');
const router = express.Router();

// 로그인 여부 체크
router.route('/authcheck').get((req, res) => {
  const sendData = { isLogin: '' };
  console.log(req.session);
  if (req.session.passport.user) {
    sendData.isLogin = 'True';
  } else {
    sendData.isLogin = 'False';
  }
  res.send(sendData);
});

router.route('/kakao/oauth').get(authController.kakaoLoginCallback);

module.exports = router;
