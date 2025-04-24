// src/configs/i18n.js 수정
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

// 언어별 로케일 plugins
import "dayjs/locale/ko";
import "dayjs/locale/en";
import "dayjs/locale/zh-cn";

// dayjs 플러그인 설정
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

// 기본 로케일 설정
dayjs.locale("ko");

i18n
  // 백엔드 로드 (언어 파일)
  .use(Backend)
  // 브라우저 언어 감지
  .use(LanguageDetector)
  // React-i18next 초기화
  .use(initReactI18next)
  // i18n 초기화
  .init({
    // 기본 언어
    fallbackLng: "ko",

    // 지원하는 언어 목록
    supportedLngs: ["ko", "en", "zh"],

    // 감지 옵션
    detection: {
      order: ["localStorage", "cookie", "navigator"],
      caches: ["localStorage", "cookie"],
    },

    // 백엔드 옵션
    backend: {
      // 언어 파일 경로
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    // 네임스페이스
    ns: ["translation"],
    defaultNS: "translation",

    // 디버그 모드 (개발 환경에서만 활성화)
    debug: process.env.NODE_ENV === "development",

    // 언어 간 키 누락 감지
    keySeparator: ".",

    // React 옵션
    react: {
      useSuspense: true,
    },

    // 보간 옵션
    interpolation: {
      escapeValue: false, // React에서는 이미 XSS 방지됨
      // 사용자 정의 포맷팅 함수
      format: (value, format, lng) => {
        if (value instanceof Date) {
          // dayjs 로케일 설정 - 이미 사용 중인 로케일과 다를 때만 변경
          const locale = lng === "zh" ? "zh-cn" : lng;

          // Avoid unnecessary locale changes
          if (dayjs.locale() !== locale) {
            dayjs.locale(locale);
          }

          if (format === "short") {
            return dayjs(value).format("L");
          }
          if (format === "long") {
            return dayjs(value).format("LLLL");
          }
          if (format === "relative") {
            return dayjs(value).format("YYYY년 MMMM D일 dddd A h시 mm분");
          }
          if (format === "ago") {
            return dayjs(value).fromNow();
          }

          return dayjs(value).format(format);
        }

        // 숫자 포맷팅
        if (format === "number" && typeof value === "number") {
          return new Intl.NumberFormat(lng).format(value);
        }

        // 통화 포맷팅
        if (format === "currency" && typeof value === "number") {
          const currencyMap = {
            ko: "KRW",
            en: "USD",
            zh: "CNY",
          };

          return new Intl.NumberFormat(lng, {
            style: "currency",
            currency: currencyMap[lng] || "USD",
          }).format(value);
        }

        return value;
      },
    },
  });

// 언어 변경 시 dayjs 로케일도 함께 변경
i18n.on("languageChanged", (lng) => {
  const locale = lng === "zh" ? "zh-cn" : lng;
  dayjs.locale(locale);
});

export default i18n;
