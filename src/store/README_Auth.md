# AuthStore 사용 가이드

Zustand를 사용한 인증 상태 관리 스토어입니다.

## 기본 사용법

```jsx
import useAuthStore from "./store/AuthStore";

function LoginComponent() {
  const { isAuthenticated, user, loading, error, login, logout } =
    useAuthStore();

  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      console.log("로그인 성공");
    } else {
      console.error("로그인 실패:", result.error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>환영합니다, {user?.name}님!</p>
          <button onClick={logout}>로그아웃</button>
        </div>
      ) : (
        <div>
          <button
            onClick={() =>
              handleLogin({ email: "test@test.com", password: "123" })
            }
          >
            로그인
          </button>
          {loading && <p>로그인 중...</p>}
          {error && <p>오류: {error}</p>}
        </div>
      )}
    </div>
  );
}
```

## 주요 기능

### 상태 (State)

- `isAuthenticated`: 로그인 상태
- `user`: 사용자 정보 객체
- `token`: 액세스 토큰
- `refreshToken`: 리프레시 토큰
- `loading`: 로딩 상태
- `error`: 에러 메시지

### 액션 (Actions)

- `login(credentials)`: 로그인
- `logout()`: 로그아웃
- `refreshAccessToken()`: 토큰 갱신
- `updateUser(userData)`: 사용자 정보 업데이트
- `setToken(token)`: 토큰 설정
- `clearError()`: 에러 클리어
- `setLoading(loading)`: 로딩 상태 설정

### 유틸리티 함수

- `checkAuth()`: 인증 상태 확인
- `hasPermission(permission)`: 권한 확인
- `isTokenExpired()`: 토큰 만료 확인

## 권한 확인 예시

```jsx
function AdminComponent() {
  const { hasPermission } = useAuthStore();

  if (!hasPermission("admin")) {
    return <div>권한이 없습니다.</div>;
  }

  return <div>관리자 페이지</div>;
}
```

## 토큰 갱신 예시

```jsx
import axios from "axios";
import useAuthStore from "./store/AuthStore";

// Axios 인터셉터 설정
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { refreshAccessToken, logout } = useAuthStore.getState();

    if (error.response?.status === 401) {
      const result = await refreshAccessToken();
      if (result.success) {
        // 원래 요청 재시도
        return axios.request(error.config);
      } else {
        logout();
      }
    }
    return Promise.reject(error);
  }
);
```

## 로컬 스토리지 지속성

이 스토어는 `persist` 미들웨어를 사용하여 다음 상태들을 로컬 스토리지에 자동으로 저장합니다:

- `isAuthenticated`
- `user`
- `token`
- `refreshToken`

브라우저를 새로고침하거나 재시작해도 로그인 상태가 유지됩니다.

## 실제 API 연동

현재는 목업 데이터를 사용하고 있습니다. 실제 API와 연동하려면:

1. `login` 함수에서 주석 처리된 API 호출 코드를 활성화
2. `logout` 함수에서 서버 로그아웃 API 호출 추가
3. `refreshAccessToken` 함수에서 실제 토큰 갱신 API 호출

```jsx
// 예시: 실제 API 호출
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(credentials),
});
const data = await response.json();
```
