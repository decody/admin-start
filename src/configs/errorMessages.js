/**
 * 인증 및 로그인 관련 오류 메시지
 */

// 로그인 관련 오류 메시지
export const LOGIN_ERROR_MESSAGES = {
  // 폼 유효성 검사 오류
  FORM_VALIDATION: {
    EMPTY_USERNAME: "아이디를 입력해주세요.",
    USERNAME_TOO_LONG: "아이디는 20자 이하여야 합니다.",
    EMPTY_PASSWORD: "비밀번호를 입력해주세요.",
    PASSWORD_TOO_SHORT: "비밀번호는 8자 이상이어야 합니다.",
  },

  // 인증 관련 오류
  AUTH: {
    INVALID_CREDENTIALS: "아이디 또는 비밀번호가 올바르지 않습니다.",
    ACCOUNT_LOCKED: "계정이 잠겼습니다. 관리자에게 문의하세요.",
    LOGIN_BLOCKED: (seconds) =>
      `너무 많은 로그인 시도로 인해 ${seconds}초 동안 로그인이 차단되었습니다.`,
    ATTEMPT_LIMIT_EXCEEDED:
      "로그인 시도 횟수 초과로 60초 동안 로그인이 차단되었습니다.",
    SESSION_EXPIRED: "세션이 만료되었습니다. 다시 로그인해주세요.",
    REFRESH_TOKEN_MISSING: "Refresh 토큰이 없습니다.",
    INVALID_REFRESH_TOKEN: "유효하지 않은 Refresh 토큰입니다.",
  },

  // HTTP 상태 코드별 에러 메시지
  HTTP_STATUS: {
    400: "요청이 잘못되었습니다. 입력 정보를 확인해주세요.",
    401: "인증에 실패했습니다. 다시 로그인해주세요.",
    403: "이 작업을 수행할 권한이 없습니다.",
    404: "요청한 리소스를 찾을 수 없습니다.",
    409: "요청이 현재 서버의 상태와 충돌합니다.",
    429: "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
    500: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
    502: "게이트웨이 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    503: "서비스를 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.",
    504: "게이트웨이 시간 초과가 발생했습니다. 잠시 후 다시 시도해주세요.",
  },

  // 네트워크 오류
  NETWORK: {
    NO_RESPONSE: "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.",
    REQUEST_FAILED: "서버와의 통신에 실패했습니다.",
    TIMEOUT:
      "요청 시간이 초과되었습니다. 인터넷 연결을 확인하거나 잠시 후 다시 시도해주세요.",
  },

  // 기타 일반 오류
  GENERAL: {
    UNKNOWN: "알 수 없는 오류가 발생했습니다. 다시 시도해주세요.",
    LOGIN_FAILED: "로그인에 실패했습니다.",
  },
};

// 회원가입 관련 오류 메시지
export const REGISTER_ERROR_MESSAGES = {
  USERNAME_EXISTS: "이미 사용 중인 아이디입니다.",
  PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다.",
  REGISTRATION_FAILED: "회원가입에 실패했습니다. 다시 시도해주세요.",
  FORM_VALIDATION: {
    USERNAME_TOO_SHORT: "아이디는 4자 이상이어야 합니다.",
    USERNAME_TOO_LONG: "아이디는 20자 이하여야 합니다.",
    USERNAME_INVALID_FORMAT: "아이디는 영문과 숫자만 사용할 수 있습니다.",
    PASSWORD_TOO_SHORT: "비밀번호는 8자 이상이어야 합니다.",
    PASSWORD_INVALID_FORMAT:
      "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.",
    PHONE_INVALID_FORMAT: "올바른 휴대폰 번호를 입력해주세요.",
  },
};

// 토큰 관련 오류 메시지
export const TOKEN_ERROR_MESSAGES = {
  EXPIRED: "인증이 만료되었습니다. 다시 로그인해주세요.",
  INVALID: "유효하지 않은 인증입니다. 다시 로그인해주세요.",
  MISSING: "인증 정보가 없습니다. 로그인이 필요합니다.",
};

// 성공 메시지
export const SUCCESS_MESSAGES = {
  LOGIN: "로그인에 성공했습니다.",
  LOGOUT: "로그아웃 되었습니다.",
  REGISTER: "회원가입이 완료되었습니다.",
  PASSWORD_RESET: "비밀번호가 재설정되었습니다.",
};

// 알림 메시지
export const NOTIFICATION_MESSAGES = {
  TITLES: {
    LOGIN_SUCCESS: "로그인 성공",
    REGISTER_SUCCESS: "회원가입 성공",
    LOGOUT_SUCCESS: "로그아웃 성공",
    ERROR: "오류 발생",
    WARNING: "주의",
    INFO: "안내",
  },
  WELCOME: "환영합니다!",
};
