const express = require('express');
const { authController } = require('../../controllers');
const router = express.Router();

router.route('/kakao/oauth').get(authController.kakaoLoginCallback);

module.exports = router;
