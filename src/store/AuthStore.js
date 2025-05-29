import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import usePermissionStore from "./PermissionStore";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // 상태
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      loading: false,
      error: null,

      // 로그인 액션
      login: async (credentials) => {
        set({ loading: true, error: null });

        try {
          // 실제 API 호출 예시 (필요에 따라 수정)
          // const response = await authAPI.login(credentials);
          // const { user, token, refreshToken } = response.data;

          // 임시 데이터 (실제 API 연동 시 위 코드로 교체)
          const mockUser = {
            id: 1,
            email: credentials.email,
            name: "관리자",
            role: "admin",
            permissions: [], // 커스텀 권한 배열
          };
          const mockToken = "mock-jwt-token";
          const mockRefreshToken = "mock-refresh-token";

          set({
            isAuthenticated: true,
            user: mockUser,
            token: mockToken,
            refreshToken: mockRefreshToken,
            loading: false,
            error: null,
          });

          // PermissionStore에 사용자 역할 설정
          const { setUserRole, setCustomPermissions } =
            usePermissionStore.getState();
          setUserRole(mockUser.role);
          if (mockUser.permissions && mockUser.permissions.length > 0) {
            setCustomPermissions(mockUser.permissions);
          }

          return { success: true, user: mockUser };
        } catch (error) {
          set({
            loading: false,
            error: error.message || "로그인에 실패했습니다.",
          });
          return { success: false, error: error.message };
        }
      },

      // 로그아웃 액션
      logout: async () => {
        set({ loading: true });

        try {
          // 서버에 로그아웃 요청 (필요한 경우)
          // await authAPI.logout();

          set({
            isAuthenticated: false,
            user: null,
            token: null,
            refreshToken: null,
            loading: false,
            error: null,
          });

          // 권한 정보도 클리어
          const { clearPermissions } = usePermissionStore.getState();
          clearPermissions();

          // 로컬 스토리지 클리어
          localStorage.removeItem("auth-storage");
          localStorage.removeItem("permission-storage");

          return { success: true };
        } catch (error) {
          set({ loading: false });
          return { success: false, error: error.message };
        }
      },

      // 토큰 갱신
      refreshAccessToken: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          get().logout();
          return { success: false, error: "Refresh token not found" };
        }

        try {
          // 실제 API 호출 예시
          // const response = await authAPI.refreshToken(refreshToken);
          // const { token: newToken } = response.data;

          // 임시 데이터 (실제 API 연동 시 위 코드로 교체)
          const newToken = "new-mock-jwt-token";

          set({ token: newToken });
          return { success: true, token: newToken };
        } catch (error) {
          get().logout();
          return { success: false, error: error.message };
        }
      },

      // 사용자 정보 업데이트
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));

        // 역할이 변경된 경우 권한도 업데이트
        if (userData.role) {
          const { setUserRole } = usePermissionStore.getState();
          setUserRole(userData.role);
        }

        // 커스텀 권한이 변경된 경우 업데이트
        if (userData.permissions) {
          const { setCustomPermissions } = usePermissionStore.getState();
          setCustomPermissions(userData.permissions);
        }
      },

      // 토큰 설정
      setToken: (token) => {
        set({ token });
      },

      // 에러 클리어
      clearError: () => {
        set({ error: null });
      },

      // 로딩 상태 설정
      setLoading: (loading) => {
        set({ loading });
      },

      // 인증 상태 확인
      checkAuth: () => {
        const { token } = get();
        return !!token;
      },

      // 권한 확인 (PermissionStore 연동)
      hasPermission: (permission) => {
        const { hasPermission } = usePermissionStore.getState();
        return hasPermission(permission);
      },

      // 역할 확인 (PermissionStore 연동)
      hasRole: (role) => {
        const { hasRole } = usePermissionStore.getState();
        return hasRole(role);
      },

      // 관리자 권한 확인
      isAdmin: () => {
        const { isAdmin } = usePermissionStore.getState();
        return isAdmin();
      },

      // 토큰 만료 확인
      isTokenExpired: () => {
        const { token } = get();
        if (!token) return true;

        try {
          // JWT 토큰 디코딩하여 만료 시간 확인
          const payload = JSON.parse(atob(token.split(".")[1]));
          const currentTime = Date.now() / 1000;
          return payload.exp < currentTime;
        } catch (error) {
          return true;
        }
      },

      // 사용자 역할별 로그인 (테스트용)
      loginWithRole: async (role) => {
        const credentials = { email: `${role}@test.com`, password: "123456" };

        // 역할별 모의 사용자 데이터
        const roleUserData = {
          admin: { name: "시스템 관리자", role: "admin" },
          manager: { name: "프로젝트 매니저", role: "manager" },
          internal: { name: "내부 사용자", role: "internal" },
          external: { name: "외부 사용자", role: "external" },
          user: { name: "일반 사용자", role: "user" },
        };

        const userData = roleUserData[role] || roleUserData.user;

        set({ loading: true, error: null });

        try {
          const mockUser = {
            id: Math.floor(Math.random() * 1000),
            email: credentials.email,
            ...userData,
            permissions: [],
          };

          set({
            isAuthenticated: true,
            user: mockUser,
            token: `mock-${role}-token`,
            refreshToken: `mock-${role}-refresh-token`,
            loading: false,
            error: null,
          });

          // PermissionStore에 사용자 역할 설정
          const { setUserRole } = usePermissionStore.getState();
          setUserRole(mockUser.role);

          return { success: true, user: mockUser };
        } catch (error) {
          set({
            loading: false,
            error: error.message || "로그인에 실패했습니다.",
          });
          return { success: false, error: error.message };
        }
      },
    }),
    {
      name: "auth-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

export default useAuthStore;
