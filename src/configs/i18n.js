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

// 번역 리소스
const resources = {
  ko: {
    translation: {
      language: {
        ko: "한국어",
        en: "English",
        zh: "中文",
      },
      menu: {
        home: "홈",
        dashboard: "대시보드",
        users: "사용자 관리",
        settings: "설정",
      },
      common: {
        save: "저장",
        cancel: "취소",
        delete: "삭제",
        category: "카테고리",
        example: "예시",
      },
      examples: {
        title: "다국어 지원 예제",
        menu: "메뉴 예시",
        buttons: "버튼 예시",
        dates: "날짜 예시",
        numbers: "숫자 예시",
      },
    },
  },
  en: {
    translation: {
      language: {
        ko: "Korean",
        en: "English",
        zh: "Chinese",
      },
      menu: {
        home: "Home",
        dashboard: "Dashboard",
        users: "User Management",
        settings: "Settings",
      },
      common: {
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        category: "Category",
        example: "Example",
      },
      examples: {
        title: "Internationalization Example",
        menu: "Menu Examples",
        buttons: "Button Examples",
        dates: "Date Examples",
        numbers: "Number Examples",
      },
    },
  },
  zh: {
    translation: {
      language: {
        ko: "韩语",
        en: "英语",
        zh: "中文",
      },
      menu: {
        home: "首页",
        dashboard: "仪表板",
        users: "用户管理",
        settings: "设置",
      },
      common: {
        save: "保存",
        cancel: "取消",
        delete: "删除",
        category: "类别",
        example: "示例",
      },
      examples: {
        title: "国际化示例",
        menu: "菜单示例",
        buttons: "按钮示例",
        dates: "日期示例",
        numbers: "数字示例",
      },
    },
  },
};

i18n
  // 백엔드 로드 (언어 파일)
  .use(Backend)
  // 브라우저 언어 감지
  .use(LanguageDetector)
  // React-i18next 초기화
  .use(initReactI18next)
  // i18n 초기화
  .init({
    resources,
    fallbackLng: "ko",
    debug: process.env.NODE_ENV === "development",

    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        if (value instanceof Date) {
          const locale = lng === "zh" ? "zh-cn" : lng;

          if (dayjs.locale() !== locale) {
            dayjs.locale(locale);
          }

          switch (format) {
            case "short":
              return dayjs(value).format("L");
            case "long":
              return dayjs(value).format("LLLL");
            case "relative":
              return dayjs(value).fromNow();
            case "ago":
              return dayjs(value).fromNow();
            default:
              return dayjs(value).format(format);
          }
        }

        if (format === "number" && typeof value === "number") {
          return new Intl.NumberFormat(lng).format(value);
        }

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
