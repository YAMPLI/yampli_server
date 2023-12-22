const jwt = require('jsonwebtoken');
const { UnauthenticatedError, ConflictError } = require('../utils/errors');
const secretKey = process.env.JWT_SECRET;

/**
 * Access, Refresh JWT 토큰 생성
 * @param {Object} user - 로그인 유저 데이터
 * @returns {Object} - ATK, RTK 생성
 */
const createToken = (user) => {
  try {
    const accessToken = jwt.sign(
      {
        email: user.email,
        role: user.role,
      },
      secretKey,
      { expiresIn: '2h' },
    );

    const refreshToken = jwt.sign(
      {
        email: user.eamil,
        role: user.role,
      },
      secretKey,
      { expiresIn: '24h' },
    );
    return { accessToken, refreshToken };
  } catch (err) {
    console.error('Error generating token:', err);
    throw new ConflictError('입력하신 정보를 다시 확인하시고 로그인 해주세요.');
  }
};

/**
 * 복호화된 토큰 데이터 반환
 * @param {Object} token - JWT 토큰
 * @returns 복호화된 데이터
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      console.error('토큰이 유효하지 않습니다', err);
      throw new UnauthenticatedError('토큰이 유효하지 않습니다.');
    } else {
      console.error('잠시 후 다시 시도해주세요.', err);
      throw new Error('잠시 후 다시 시도해주세요.');
    }
  }
};

module.exports = {
  createToken,
  verifyToken,
};
