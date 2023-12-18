const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('./customApiError');

/**
 * 403(FORBIDDEN) : 허용하지 않는 웹 페이지로 접근, 접근 권한, 인증 만료된 페이지
 */
class ForbiddenError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
module.exports = ForbiddenError;
