const { authService } = require('../services');
const { userService } = require('../services');
const { StatusCodes } = require('http-status-codes');
const passport = require('passport');

const kakaoLoginCallback = async (req, res, next) => {
  passport.authenticate('kakao', { failureRedirect: '/' }, async (err, user) => {
    if (err) return next(err);
    const userId = user.id;
    const userInfo = await userService.getUserById(userId);
    const token = await userService.createJWT(userInfo);
    res.status(StatusCodes.OK).json({ token });
  })(req, res, next);
};
module.exports = {
  kakaoLoginCallback,
};
