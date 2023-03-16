const express = require('express');
const { authController } = require('../../controllers');
const passport = require('passport');
const router = express.Router();

router.route('/kakao').get(passport.authenticate('kakao'));
router.route('/kakao/callback').get(passport.authenticate('kakao', { failureRedirect: '/' }), (req, res, next) => {
  console.log(`req : ${req}`);
  res.redirect('/api/auth');
});

module.exports = router;
