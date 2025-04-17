// src/mocks/handler.js
import { http, HttpResponse } from "msw";

// 간소화된 사용자 데이터
const users = [
  {
    id: 1,
    username: "admin",
    password: "Password1!",
  },
];

// 세션 스토리지에 등록된 사용자 정보 저장
const saveUserToSessionStorage = (user) => {
  const { password, ...userWithoutPassword } = user;
  sessionStorage.setItem("user", JSON.stringify(userWithoutPassword));
};

export const handlers = [
  // 로그인 처리 - 가장 기본적인 형태로 구현
  http.post("/api/auth/login", async ({ request }) => {
    try {
      const body = await request.json();
      const { username, password } = body;

      // 사용자 인증
      const user = users.find(
        (user) => user.username === username && user.password === password
      );

      if (!user) {
        return HttpResponse.json(
          { message: "아이디 또는 비밀번호가 올바르지 않습니다." },
          { status: 401 }
        );
      }

      // 세션에 사용자 정보 저장
      saveUserToSessionStorage(user);

      return HttpResponse.json({
        accessToken: `mock-jwt-token-${user.id}-${Date.now()}`,
        refreshToken: `mock-refresh-token-${user.id}-${Date.now()}`,
        user: {
          id: user.id,
          username: user.username,
        },
      });
    } catch (error) {
      console.error("MSW 핸들러 오류:", error);
      return HttpResponse.json(
        { message: "서버 오류가 발생했습니다." },
        { status: 500 }
      );
    }
  }),

  // 회원가입 처리
  http.post("/api/auth/register", async ({ request }) => {
    const body = await request.json();
    const { username, password, phoneNumber } = body;

    // 중복 사용자 확인
    const existingUser = users.find((user) => user.username === username);

    if (existingUser) {
      return new HttpResponse(
        JSON.stringify({
          message: "이미 사용 중인 아이디입니다.",
        }),
        {
          status: 409,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // 새 사용자 생성
    const newUser = {
      id: users.length + 1,
      username,
      password,
      phoneNumber,
    };

    users.push(newUser);

    // 세션에 사용자 정보 저장
    saveUserToSessionStorage(newUser);

    return HttpResponse.json(
      {
        accessToken: "mock-jwt-token-" + newUser.id + "-" + Date.now(),
        refreshToken: "mock-refresh-token-" + newUser.id + "-" + Date.now(),
        user: {
          id: newUser.id,
          username: newUser.username,
          phoneNumber: newUser.phoneNumber,
        },
      },
      { status: 201 }
    );
  }),

  // 사용자 정보 조회
  http.get("/api/auth/me", () => {
    const userJson = sessionStorage.getItem("user");

    if (!userJson) {
      return new HttpResponse(
        JSON.stringify({
          message: "인증되지 않은 사용자입니다.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const user = JSON.parse(userJson);

    return HttpResponse.json(
      {
        user,
      },
      { status: 200 }
    );
  }),

  // 로그아웃
  http.post("/api/auth/logout", () => {
    sessionStorage.removeItem("user");

    return HttpResponse.json(
      {
        message: "로그아웃 되었습니다.",
      },
      { status: 200 }
    );
  }),

  // 토큰 갱신
  http.post("/api/auth/refresh", async ({ request }) => {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return new HttpResponse(
        JSON.stringify({
          message: "Refresh 토큰이 제공되지 않았습니다.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // refreshToken이 유효한지 확인 (실제로는 서버에서 검증)
    if (!refreshToken.startsWith("mock-refresh-token-")) {
      return new HttpResponse(
        JSON.stringify({
          message: "유효하지 않은 Refresh 토큰입니다.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const userJson = sessionStorage.getItem("user");

    if (!userJson) {
      return new HttpResponse(
        JSON.stringify({
          message: "세션이 만료되었습니다. 다시 로그인해주세요.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const user = JSON.parse(userJson);

    return HttpResponse.json(
      {
        accessToken: "mock-jwt-token-" + user.id + "-" + Date.now(),
        user,
      },
      { status: 200 }
    );
  }),
];
