import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { apiClient } from "../apis/axios";
// i18n 사용을 위한 훅 추가
import { useTranslation } from "react-i18next";
import {
  LOGIN_ERROR_MESSAGES,
  TOKEN_ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  NOTIFICATION_MESSAGES,
} from "../configs/errorMessages";

// Zod 스키마 정의 - 공통 에러 메시지 사용
const signInSchema = z.object({
  username: z
    .string()
    .min(1, LOGIN_ERROR_MESSAGES.FORM_VALIDATION.EMPTY_USERNAME)
    .max(20, LOGIN_ERROR_MESSAGES.FORM_VALIDATION.USERNAME_TOO_LONG),
  password: z
    .string()
    .min(1, LOGIN_ERROR_MESSAGES.FORM_VALIDATION.EMPTY_PASSWORD)
    .min(8, LOGIN_ERROR_MESSAGES.FORM_VALIDATION.PASSWORD_TOO_SHORT),
});

export default function SignIn() {
  // useTranslation 훅 사용
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [loginBlocked, setLoginBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  // 이미 로그인한 사용자 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // 토큰 유효성 검사
      validateToken(token);
    }
  }, [navigate]);

  // 로그인 시도 제한 타이머
  useEffect(() => {
    let timer;
    if (loginBlocked && blockTimeRemaining > 0) {
      timer = setTimeout(() => {
        setBlockTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (blockTimeRemaining === 0 && loginBlocked) {
      setLoginBlocked(false);
      setLoginAttempts(0);
    }

    return () => clearTimeout(timer);
  }, [loginBlocked, blockTimeRemaining]);

  // 토큰 유효성 검사 - apiClient 사용
  const validateToken = async (token) => {
    try {
      // 사용자 정보 가져오기 API 호출
      await apiClient.get("/auth/me"); // 토큰은 apiClient 인터셉터에서 자동으로 추가됨

      // 유효한 토큰이면 홈으로 리다이렉트
      navigate("/");
    } catch (error) {
      // 토큰이 유효하지 않으면 로컬 스토리지에서 제거 (401 오류 처리는 인터셉터에서 수행)
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
  };

  // 로그인 처리 함수
  const onSubmit = async (data) => {
    // 로그인 차단 상태 확인
    if (loginBlocked) {
      setError("root", {
        type: "manual",
        message: LOGIN_ERROR_MESSAGES.AUTH.LOGIN_BLOCKED(blockTimeRemaining),
      });
      return;
    }

    setIsLoading(true);
    try {
      // apiClient를 사용하여 로그인 요청 (MSW가 이 엔드포인트를 가로채서 처리)
      const response = await apiClient.post("/auth/login", data);

      // JWT 토큰 저장 - 토큰은 인터셉터에서 관리되지만 로그인 직후에는 수동으로 저장
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // 로그인 성공 시 시도 횟수 초기화
      setLoginAttempts(0);

      // 로그인 성공 알림 표시
      showNotification(
        NOTIFICATION_MESSAGES.TITLES.LOGIN_SUCCESS,
        SUCCESS_MESSAGES.LOGIN
      );

      // 로그인 성공 후 메인 페이지로 이동
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      // 로그인 시도 횟수 증가 및 제한 처리
      handleLoginFailure(error, data);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 실패 처리를 별도 함수로 분리
  const handleLoginFailure = (error, formData) => {
    // 로그인 시도 횟수 증가
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);

    // 5회 이상 실패 시 계정 일시 차단
    if (newAttempts >= 5) {
      handleLoginBlocking();
    } else if (error.response) {
      // 응답에 userMessage가 있으면 사용 (axiosInstance에서 추가됨)
      setError("root", {
        type: "manual",
        message: error.userMessage || getErrorMessageByStatus(error),
      });

      // 401 오류인 경우 비밀번호만 초기화
      if (error.response.status === 401) {
        reset({ username: formData.username, password: "" });
      }
    } else {
      // 응답이 없는 경우 네트워크 오류 메시지 표시
      setError("root", {
        type: "manual",
        message:
          error.userMessage || LOGIN_ERROR_MESSAGES.NETWORK.REQUEST_FAILED,
      });
    }
  };

  // 로그인 차단 처리
  const handleLoginBlocking = () => {
    setLoginBlocked(true);
    setBlockTimeRemaining(60); // 60초 차단
    setError("root", {
      type: "manual",
      message: LOGIN_ERROR_MESSAGES.AUTH.ATTEMPT_LIMIT_EXCEEDED,
    });
    reset(); // 폼 초기화
  };

  // HTTP 상태 코드에 따른 에러 메시지 반환
  const getErrorMessageByStatus = (error) => {
    const status = error.response.status;

    if (LOGIN_ERROR_MESSAGES.HTTP_STATUS[status]) {
      return status === 401 && error.response.data.message
        ? error.response.data.message
        : LOGIN_ERROR_MESSAGES.HTTP_STATUS[status];
    }

    return (
      error.response.data.message || LOGIN_ERROR_MESSAGES.GENERAL.LOGIN_FAILED
    );
  };

  // 브라우저 알림 표시
  const showNotification = (title, message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/logo.png",
      });
    } else if (
      "Notification" in window &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, {
            body: message,
            icon: "/logo.png",
          });
        }
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-2xl">
        <div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
            {/* 로그인 */}
            {t("auth.login")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {/* 계정 정보를 입력하여 로그인하세요 */}
            {t("auth.loginPrompt")}
          </p>
          {loginBlocked && (
            <div className="mt-2 text-center text-sm">
              <p className="text-red-600 font-medium">
                {blockTimeRemaining}초 후에 다시 시도할 수 있습니다.
              </p>
            </div>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                {/* 아이디 */}
                {t("auth.username")}
              </label>
              <div className="mt-1">
                <input
                  {...register("username")}
                  id="username"
                  type="text"
                  autoComplete="username"
                  disabled={loginBlocked || isLoading}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="아이디를 입력하세요"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {/* 비밀번호 */}
                {t("auth.password")}
              </label>
              <div className="mt-1">
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  disabled={loginBlocked || isLoading}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="비밀번호를 입력하세요"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {errors.root && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errors.root.message}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                disabled={loginBlocked}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                {/* 로그인 상태 유지 */}
                {t("auth.rememberMe")}
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {/* 비밀번호를 잊으셨나요? */}
                {t("auth.forgotPassword")}
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || loginBlocked}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {/* 로그인 중... */}
                  {t("auth.loginProcessing")}
                </span>
              ) : loginBlocked ? (
                <span>
                  {/* 다시 시도 */}
                  {t("auth.retry")}
                </span>
              ) : (
                <span>
                  {/* 로그인 */}
                  {t("auth.login")}
                </span>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {/* 계정이 없으신가요? */}
              {t("auth.noAccount")}
              <Link
                to="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {/* 회원가입 */}
                {t("auth.signup")}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
