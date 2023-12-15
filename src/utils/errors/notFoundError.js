const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('./customApiError');
/**
 * 404(NOT_FOUND) : 클라이언트 요청을 찾을 수 없음
 */
class notFoundError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = notFoundError;
