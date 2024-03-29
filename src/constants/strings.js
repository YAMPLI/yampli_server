const ALERT = {
  CHECK_SIGN_EMAIL: `이미 가입된 이메일입니다. 이메일로 로그인 해주세요.`, // 409
  CHECK_INPUT_DATA: `입력하신 정보가 옳바르지 않습니다. 확인하여 다시 입력해주세요.`, // 409
  RETRY_REQ: `네트워크가 불안정합니다. 잠시 후 다시 시도해주세요.`, // 500
  AUTH_MAIL_RES_ERR: `인증메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요. `,
  NOT_VALID_PAGE_EXPIRE_TOKEN: `인증 링크가 유효하지 않습니다.|주소를 확인하거나 다시 회원가입을 진행해주세요.`, // 403
};

const REDIS = {
  PREFIX_DB_SUFFIX_FAIL(text) {
    return `REDIS ${text} 실패.`;
  },
};

const STRINGS = { ALERT, REDIS };

module.exports = STRINGS;
