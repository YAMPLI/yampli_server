const { authService } = require('../services');

const kakaoLogin = async (req, res) => {
  try {
    const user = await authService.kakaoLogin(req);
    console.log(user);
    res.json({ status: 'success' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  kakaoLogin,
};
