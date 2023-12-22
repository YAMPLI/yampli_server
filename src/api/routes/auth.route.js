const express = require('express');
const { authController, userController } = require('../../controllers');
const { asyncWrap } = require('../middlewares/async');
const router = express.Router();

router.route('/kakao/oauth').get(asyncWrap(authController.kakaoLoginCallback));
router.route('/auth-email').get(asyncWrap(authController.authEmail));
router.route('/login').get(asyncWrap(authController.loginByEmail));
// 텍스트 처리 후 스포티파이 썸네일 검색
// http://localhost:3306/api/auth/spotify/callback

module.exports = router;
