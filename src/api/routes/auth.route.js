const express = require('express');
const { authController } = require('../../controllers');
const router = express.Router();

router.route('/kakao/oauth').get(authController.kakaoLoginCallback);

// 텍스트 처리 후 스포티파이 썸네일 검색
// http://localhost:3306/api/auth/spotify/callback

module.exports = router;
