const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('./customApiError');
/**
 * 409(CONFLICT) : 서버 리소스와의 충돌(수정 데이터 타입 불일치, 가입된 회원의 재 가입시도..)
 */
class ConflictError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
  }
}
module.exports = ConflictError;
