import { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // API를 통해 사용자 정보 가져오기
  const fetchUserInfo = useCallback(async (token) => {
    try {
      const response = await axios.get("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.user) {
        setUsername(response.data.user.username || "사용자");
      }
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      // 토큰이 만료된 경우 로그아웃 처리
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  }, []);

  // 사용자 인증 상태 확인
  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    const userInfo = sessionStorage.getItem("user");

    if (token) {
      setIsLoggedIn(true);

      if (userInfo) {
        try {
          const parsedUser = JSON.parse(userInfo);
          setUsername(parsedUser.username || "사용자");
        } catch (error) {
          console.error("사용자 정보 파싱 오류:", error);
          setUsername("사용자");
        }
      } else {
        // JWT 토큰이 있지만 사용자 정보가 없는 경우 API로 사용자 정보 조회
        fetchUserInfo(token);
      }
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }
  }, [fetchUserInfo]);

  // 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname, checkAuthStatus]);

  // 로그아웃 처리
  const handleLogout = useCallback(async () => {
    try {
      // 로그아웃 API 호출
      await axios.post("/api/auth/logout");
    } catch (error) {
      console.error("로그아웃 요청 실패:", error);
    } finally {
      // 로컬 스토리지에서 토큰 제거
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("user");

      // axios 헤더에서 인증 정보 제거
      delete axios.defaults.headers.common["Authorization"];

      // 인증 상태 업데이트
      setIsLoggedIn(false);
      setUsername("");

      // 홈페이지로 리다이렉트
      navigate("/");
    }
  }, [navigate]);

  return (
    <header>
      <div>
        <div>
          <h1>
            <Link to="/">
              <img src="" className="app-logo" alt="로고" />
            </Link>
          </h1>
          <div>
            <LanguageSwitcher />
            <div></div>
            {isLoggedIn ? (
              <>
                <span>
                  <span>안녕하세요,</span> {username}님
                </span>
                <button onClick={handleLogout}>로그아웃</button>
              </>
            ) : (
              <Link to="/signin">로그인</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
