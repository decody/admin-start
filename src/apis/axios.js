import axios from "axios";
import {
  LOGIN_ERROR_MESSAGES,
  TOKEN_ERROR_MESSAGES,
} from "../configs/errorMessages";

/**
 * axios 인스턴스 생성 및 기본 설정
 */
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api", // 환경변수로 API URL 설정 또는 기본값 사용
  timeout: 10000, // 10초 타임아웃 설정
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * 요청 인터셉터
 * - 모든 요청에 JWT 토큰 추가
 * - 요청 로깅
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // 요청 전에 처리
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // 개발 환경에서만 요청 로깅
    if (process.env.NODE_ENV === "development") {
      console.log("API 요청:", {
        url: config.url,
        method: config.method,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    // 요청 에러 처리
    console.error("API 요청 에러:", error);
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터
 * - 응답 데이터 전처리
 * - 에러 응답 처리 (토큰 만료, 서버 에러 등)
 * - 토큰 리프레시 로직
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 데이터 처리
    if (process.env.NODE_ENV === "development") {
      console.log("API 응답:", {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 토큰 만료 등으로 인한 401 오류 처리
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // 이미 재시도했는지 확인
      originalRequest._retry = true;

      try {
        // 리프레시 토큰으로 새 액세스 토큰 발급 시도
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error(TOKEN_ERROR_MESSAGES.MISSING);
        }

        const response = await axios.post("/api/auth/refresh", {
          refreshToken,
        });
        const { accessToken } = response.data;

        // 새 토큰 저장
        localStorage.setItem("accessToken", accessToken);

        // 헤더 업데이트
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        // 원래 요청 재시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // 로그인 페이지로 리다이렉트
        window.location.href = "/signin";

        return Promise.reject({
          ...error,
          message: TOKEN_ERROR_MESSAGES.EXPIRED,
        });
      }
    }

    // 에러 응답의 상태 코드에 따른 메시지 설정
    let errorMessage =
      error.response?.data?.message || LOGIN_ERROR_MESSAGES.GENERAL.UNKNOWN;

    // HTTP 상태 코드에 따른 에러 메시지
    if (
      error.response &&
      LOGIN_ERROR_MESSAGES.HTTP_STATUS[error.response.status]
    ) {
      errorMessage = LOGIN_ERROR_MESSAGES.HTTP_STATUS[error.response.status];
    }
    // 네트워크 오류 (서버에 요청을 보냈지만 응답이 없는 경우)
    else if (error.request) {
      errorMessage = LOGIN_ERROR_MESSAGES.NETWORK.NO_RESPONSE;
    }
    // 요청 설정 중 오류
    else {
      errorMessage = LOGIN_ERROR_MESSAGES.NETWORK.REQUEST_FAILED;
    }

    // 개발 환경에서 에러 로깅
    if (process.env.NODE_ENV === "development") {
      console.error("API 에러:", {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        message: errorMessage,
        detail: error.message,
      });
    }

    // 에러 객체에 메시지 추가
    error.userMessage = errorMessage;

    return Promise.reject(error);
  }
);

/**
 * HTTP 메소드 별 래퍼 함수
 */
export const apiClient = {
  /**
   * GET 요청
   * @param {string} url - 요청 URL
   * @param {Object} params - URL 파라미터
   * @param {Object} config - 추가 설정
   */
  get: (url, params = {}, config = {}) => {
    return axiosInstance.get(url, { ...config, params });
  },

  /**
   * POST 요청
   * @param {string} url - 요청 URL
   * @param {Object} data - 요청 바디
   * @param {Object} config - 추가 설정
   */
  post: (url, data = {}, config = {}) => {
    return axiosInstance.post(url, data, config);
  },

  /**
   * PUT 요청
   * @param {string} url - 요청 URL
   * @param {Object} data - 요청 바디
   * @param {Object} config - 추가 설정
   */
  put: (url, data = {}, config = {}) => {
    return axiosInstance.put(url, data, config);
  },

  /**
   * PATCH 요청
   * @param {string} url - 요청 URL
   * @param {Object} data - 요청 바디
   * @param {Object} config - 추가 설정
   */
  patch: (url, data = {}, config = {}) => {
    return axiosInstance.patch(url, data, config);
  },

  /**
   * DELETE 요청
   * @param {string} url - 요청 URL
   * @param {Object} config - 추가 설정
   */
  delete: (url, config = {}) => {
    return axiosInstance.delete(url, config);
  },

  /**
   * 파일 업로드 POST 요청
   * @param {string} url - 요청 URL
   * @param {FormData} formData - 파일 및 기타 폼 데이터
   * @param {Object} config - 추가 설정
   */
  upload: (url, formData, config = {}) => {
    return axiosInstance.post(url, formData, {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * CSV/Excel 파일 다운로드 GET 요청
   * @param {string} url - 요청 URL
   * @param {Object} params - URL 파라미터
   * @param {string} filename - 저장할 파일명
   */
  download: async (url, params = {}, filename = "download") => {
    try {
      const response = await axiosInstance.get(url, {
        params,
        responseType: "blob",
      });

      // 파일명 얻기 (서버에서 제공하는 경우)
      const contentDisposition = response.headers["content-disposition"];
      let serverFilename;

      if (contentDisposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
          serverFilename = matches[1].replace(/['"]/g, "");
        }
      }

      // Blob URL 생성
      const blob = new Blob([response.data]);
      const blobUrl = window.URL.createObjectURL(blob);

      // 다운로드 링크 생성 및 클릭
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", serverFilename || filename);
      document.body.appendChild(link);
      link.click();

      // 정리
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);

      return true;
    } catch (error) {
      console.error("파일 다운로드 실패:", error);
      throw error;
    }
  },
};

// 기본 axios 인스턴스 내보내기
export default axiosInstance;
