const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('./customApiError');
/**
 * 401(Unauthorized) : 클라이언트 미인증 상태
 */
class UnauthenticatedError extends CustomApiError {
  constructor(message, isEmail = null) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.isEmail = isEmail;
  }
}

module.exports = UnauthenticatedError;
