// 핸들러에서 자동으로 500 부여
exports.CustomApiError = require('./customApiError.js');
// 400(BAD_REQUEST) : 요청 문법 오류(ex : URL 주소 불일치)
exports.BadRequestError = require('./badRequestError');
// 401(Unauthorized) : 클라이언트 미인증 상태
exports.UnauthenticatedError = require('./unauthentiocated.js');
// 404(NOT_FOUND) : 클라이언트 요청을 찾을 수 없음
exports.NotFoundError = require('./notFoundError');
// 409(CONFLICT) : 서버 리소스와의 충돌(수정 데이터 타입 불일치, 가입된 회원의 재 가입시도..)
exports.ConflictError = require('./conflictError');
// 403(FORBIDDEN) : 허용하지 않는 웹 페이지로 접근, 접근 권한, 인증 만료된 페이지
exports.ForbiddenError = require('./forbiddenError.js');
