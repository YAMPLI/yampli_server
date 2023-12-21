const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('./customApiError');

/**
 * 400(BAD_REQUEST) : 요청 문법 오류(ex : URL 주소 불일치)
 */
class BadRequestError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
module.exports = BadRequestError;
