const { authService } = require('../services');
const { userService } = require('../services');
const { StatusCodes } = require('http-status-codes');
const kakaoStrategy1 = require('../config/passport/kakaoStrategy1');
const passport = require('passport');

const kakaoLoginCallback = async (req, res, next) => {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const callbackUrl =
    clientIp === '127.0.0.1'
      ? 'http://example1.local:8080/kakao/oauth'
      : 'https://43bf-106-241-78-77.ngrok-free.app/kakao/oauth';
  const kakaoStrategy11 = kakaoStrategy1(callbackUrl);
  passport.use(kakaoStrategy11);
  passport.authenticate('kakao', { failureRedirect: '/' }, async (err, user) => {
    if (err) return next(err);
    const userId = user._id;
    const userInfo = await userService.getUserById(userId);
    const token = await userService.createJWT(userInfo);
    res.status(StatusCodes.OK).json({ token });
  })(req, res, next);
};

module.exports = {
  kakaoLoginCallback,
};
