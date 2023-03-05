const express = require('express');
const { authController } = require('../../controllers');
const router = express.Router();

router.route('/kakao/start').get(authController.kakaoLogin);

module.exports = router;
