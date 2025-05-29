# 애플리케이션 설정 가이드 (Application Configuration Guide)

## 목차 (Table of Contents)

1. [개요 (Overview)](#overview)
2. [레이아웃 설정 (Layout Configuration)](#layout-configuration)
3. [사이드바 설정 (Sidebar Configuration)](#sidebar-configuration)
4. [모달 설정 (Modal Configuration)](#modal-configuration)
5. [페이지 설정 (Page Configuration)](#page-configuration)
6. [다국어 지원 (Internationalization)](#internationalization)

## 개요 (Overview) <a name="overview"></a>

`AppConfig.js`는 애플리케이션의 전반적인 설정을 관리하는 중앙 설정 파일입니다. 레이아웃, 사이드바, 모달, 페이지 타입, 다국어 지원 등의 설정을 포함합니다.

## 레이아웃 설정 (Layout Configuration) <a name="layout-configuration"></a>

Ant Design의 Layout 컴포넌트를 기반으로 한 레이아웃 설정입니다.

```javascript
export const layoutConfig = {
  sider: {
    theme: "light", // 사이드바 테마 ('light' | 'dark')
    collapsible: true, // 접기/펼치기 가능 여부
    width: 256, // 펼쳐진 상태의 너비
    collapsedWidth: 80, // 접힌 상태의 너비
    breakpoint: "lg", // 반응형 브레이크포인트
  },
  header: {
    height: 64, // 헤더 높이
    background: "#fff", // 배경색
    position: "fixed", // 고정 위치
  },
  content: {
    margin: "88px 24px 24px", // 여백
    minHeight: "calc(100vh - 112px)", // 최소 높이
  },
  footer: {
    textAlign: "center", // 텍스트 정렬
    padding: "24px 50px", // 패딩
  },
};
```

## 사이드바 설정 (Sidebar Configuration) <a name="sidebar-configuration"></a>

메뉴 구조와 네비게이션을 정의하는 사이드바 설정입니다.

```javascript
export const sidebarConfig = {
  menu: [
    {
      key: "dashboard", // 고유 키
      icon: "DashboardOutlined", // Ant Design 아이콘
      label: "menu.dashboard", // i18n 키
      path: "/dashboard", // 라우트 경로
      children: [], // 하위 메뉴 (선택사항)
    },
  ],
};
```

### 메뉴 아이템 속성

- `key`: 메뉴 아이템의 고유 식별자
- `icon`: Ant Design 아이콘 컴포넌트 이름
- `label`: 다국어 지원을 위한 번역 키
- `path`: 라우팅 경로
- `children`: 하위 메뉴 아이템 배열 (선택사항)
- `permissions`: 접근 권한 배열 (선택사항)

## 모달 설정 (Modal Configuration) <a name="modal-configuration"></a>

Ant Design Modal의 기본 설정입니다.

```javascript
export const modalConfig = {
  defaultWidth: 520, // 기본 너비
  confirmLoading: true, // 로딩 표시 여부
  centered: true, // 중앙 정렬
  maskClosable: false, // 마스크 클릭시 닫기
  destroyOnClose: true, // 닫을 때 내용 제거
};
```

## 페이지 설정 (Page Configuration) <a name="page-configuration"></a>

페이지 타입과 속성을 정의하는 설정입니다.

### 페이지 타입

```javascript
export const pageTypes = {
  MAIN: "main", // 메인 페이지
  SUB: "sub", // 서브 페이지
  DETAIL: "detail", // 상세 페이지
};
```

### 페이지별 설정

```javascript
export const pageConfig = {
  "page-key": {
    type: pageTypes.MAIN, // 페이지 타입
    breadcrumb: ["menu.home", "menu.page"], // 브레드크럼 경로
    permissions: ["view_page"], // 필요 권한
  },
};
```

## 다국어 지원 (Internationalization) <a name="internationalization"></a>

react-i18next를 사용한 다국어 지원 설정입니다.

### 지원 언어

```javascript
export const languageConfig = {
  available: [
    {
      code: "ko", // 언어 코드
      name: "한국어", // 표시 이름
      flag: "🇰🇷", // 국가 플래그
    },
    // ... 다른 언어
  ],
  default: "ko", // 기본 언어
};
```

### 사용 방법

```javascript
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t, i18n } = useTranslation();

  // 번역 사용
  return <h1>{t("menu.dashboard")}</h1>;

  // 언어 변경
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
}
```

### 번역 파일 구조

번역 파일은 `src/locales` 디렉토리에 위치하며, 각 언어별로 다음과 같은 구조를 가집니다:

```
src/locales/
  ├── ko.json     // 한국어
  ├── en.json     // 영어
  └── zh.json     // 중국어
```

각 번역 파일은 다음과 같은 구조로 구성됩니다:

```json
{
  "menu": {
    "home": "홈",
    "dashboard": "대시보드"
  },
  "common": {
    "save": "저장",
    "cancel": "취소"
  }
}
```

### 변수 사용

번역 텍스트에 변수를 포함할 수 있습니다:

```javascript
// 번역 파일
{
  "welcome": "안녕하세요, {{name}}님!"
}

// 사용
t('welcome', { name: 'John' }) // "안녕하세요, John님!"
```

## 설정 사용 예시

```javascript
import AppConfig from "./config/AppConfig";

// 레이아웃 설정 사용
const { sider, header } = AppConfig.layout;

// 사이드바 메뉴 사용
const { menu } = AppConfig.sidebar;

// 모달 설정 사용
const { defaultWidth, centered } = AppConfig.modal;

// 페이지 타입 확인
const { type, permissions } = AppConfig.page["dashboard"];

// 언어 설정 사용
const { available, default: defaultLang } = AppConfig.language;
```
