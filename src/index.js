// src/index.js 수정
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// i18n 설정 가져오기
import "./configs/i18n";

async function startApp() {
  // 개발 환경에서만 MSW 활성화
  if (process.env.NODE_ENV === "development") {
    try {
      const { worker } = await import("./mocks/browser");
      // MSW 서비스 워커 시작 (오류 처리 추가)
      await worker
        .start({
          onUnhandledRequest: "bypass",
          serviceWorker: {
            url: "/mockServiceWorker.js",
          },
        })
        .catch((error) => {
          console.error("MSW 시작 실패:", error);
        });
      console.log("MSW 모의 서버가 시작되었습니다.");
    } catch (error) {
      console.error("MSW 설정 오류:", error);
    }
  }

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <React.Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.Suspense>
    </React.StrictMode>
  );
}

// 앱 시작
startApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
