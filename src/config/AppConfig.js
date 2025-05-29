import { Layout } from "antd";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "../locales/en.json";
import koTranslations from "../locales/ko.json";
import zhTranslations from "../locales/zh.json";

// i18n 설정
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations,
    },
    ko: {
      translation: koTranslations,
    },
    zh: {
      translation: zhTranslations,
    },
  },
  lng: "ko", // 기본 언어
  fallbackLng: "en", // 번역 키가 없을 경우 영어로 폴백
  interpolation: {
    escapeValue: false,
  },
});

// 레이아웃 설정
export const layoutConfig = {
  sider: {
    theme: "light",
    collapsible: true,
    defaultCollapsed: false,
    width: 256,
    collapsedWidth: 80,
    breakpoint: "lg",
  },
  header: {
    height: 64,
    background: "#fff",
    padding: "0 24px",
    position: "fixed",
    zIndex: 1,
    width: "100%",
  },
  content: {
    margin: "88px 24px 24px",
    padding: 24,
    minHeight: "calc(100vh - 112px)",
    background: "#fff",
  },
  footer: {
    textAlign: "center",
    padding: "24px 50px",
    background: "#f0f2f5",
  },
};

// 사이드바 메뉴 설정
export const sidebarConfig = {
  menu: [
    {
      key: "dashboard",
      icon: "DashboardOutlined",
      label: "menu.dashboard",
      path: "/dashboard",
    },
    {
      key: "users",
      icon: "UserOutlined",
      label: "menu.users",
      path: "/users",
      children: [
        {
          key: "user-list",
          label: "menu.users.list",
          path: "/users/list",
        },
        {
          key: "user-roles",
          label: "menu.users.roles",
          path: "/users/roles",
        },
      ],
    },
    {
      key: "settings",
      icon: "SettingOutlined",
      label: "menu.settings",
      path: "/settings",
      children: [
        {
          key: "general-settings",
          label: "menu.settings.general",
          path: "/settings/general",
        },
        {
          key: "notification-settings",
          label: "menu.settings.notifications",
          path: "/settings/notifications",
        },
      ],
    },
  ],
};

// 모달 설정
export const modalConfig = {
  defaultWidth: 520,
  confirmLoading: true,
  centered: true,
  maskClosable: false,
  destroyOnClose: true,
  styles: {
    body: {
      maxHeight: "calc(100vh - 200px)",
      overflow: "auto",
    },
  },
};

// 페이지 타입 설정
export const pageTypes = {
  MAIN: "main",
  SUB: "sub",
  DETAIL: "detail",
};

// 페이지별 설정
export const pageConfig = {
  dashboard: {
    type: pageTypes.MAIN,
    breadcrumb: ["menu.home", "menu.dashboard"],
    permissions: ["view_dashboard"],
  },
  "user-list": {
    type: pageTypes.MAIN,
    breadcrumb: ["menu.home", "menu.users", "menu.users.list"],
    permissions: ["view_users"],
  },
  "user-roles": {
    type: pageTypes.SUB,
    breadcrumb: ["menu.home", "menu.users", "menu.users.roles"],
    permissions: ["manage_roles"],
  },
  "user-detail": {
    type: pageTypes.DETAIL,
    breadcrumb: ["menu.home", "menu.users", "menu.users.detail"],
    permissions: ["view_user_details"],
  },
};

// 언어 설정
export const languageConfig = {
  available: [
    {
      code: "ko",
      name: "한국어",
      flag: "🇰🇷",
    },
    {
      code: "en",
      name: "English",
      flag: "🇺🇸",
    },
    {
      code: "zh",
      name: "中文",
      flag: "🇨🇳",
    },
  ],
  default: "ko",
};

export default {
  layout: layoutConfig,
  sidebar: sidebarConfig,
  modal: modalConfig,
  page: pageConfig,
  pageTypes,
  language: languageConfig,
};
