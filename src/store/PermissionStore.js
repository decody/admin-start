import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 사용자 역할 정의
export const USER_ROLES = {
  ADMIN: "admin", // 관리자
  MANAGER: "manager", // 매니저
  EXTERNAL_USER: "external", // 외부사용자
  INTERNAL_USER: "internal", // 내부사용자
  USER: "user", // 일반 유저
};

// 권한 정의
export const PERMISSIONS = {
  // 사용자 관리
  USER_CREATE: "user:create",
  USER_READ: "user:read",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",
  USER_LIST: "user:list",

  // 시스템 관리
  SYSTEM_CONFIG: "system:config",
  SYSTEM_LOGS: "system:logs",
  SYSTEM_BACKUP: "system:backup",
  SYSTEM_MONITOR: "system:monitor",

  // 데이터 관리
  DATA_CREATE: "data:create",
  DATA_READ: "data:read",
  DATA_UPDATE: "data:update",
  DATA_DELETE: "data:delete",
  DATA_EXPORT: "data:export",
  DATA_IMPORT: "data:import",

  // 보고서
  REPORT_VIEW: "report:view",
  REPORT_CREATE: "report:create",
  REPORT_EXPORT: "report:export",
  REPORT_ADVANCED: "report:advanced",

  // 설정
  SETTINGS_VIEW: "settings:view",
  SETTINGS_EDIT: "settings:edit",

  // 승인/결재
  APPROVAL_REQUEST: "approval:request",
  APPROVAL_PROCESS: "approval:process",
  APPROVAL_ADMIN: "approval:admin",

  // 외부 연동
  EXTERNAL_API: "external:api",
  EXTERNAL_INTEGRATION: "external:integration",

  // 내부 시스템
  INTERNAL_TOOLS: "internal:tools",
  INTERNAL_ADMIN: "internal:admin",
};

// 역할별 권한 매핑
const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    // 모든 권한
    ...Object.values(PERMISSIONS),
  ],

  [USER_ROLES.MANAGER]: [
    // 사용자 관리 (삭제 제외)
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_LIST,

    // 데이터 관리
    PERMISSIONS.DATA_CREATE,
    PERMISSIONS.DATA_READ,
    PERMISSIONS.DATA_UPDATE,
    PERMISSIONS.DATA_EXPORT,
    PERMISSIONS.DATA_IMPORT,

    // 보고서
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_CREATE,
    PERMISSIONS.REPORT_EXPORT,
    PERMISSIONS.REPORT_ADVANCED,

    // 설정
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,

    // 승인/결재
    PERMISSIONS.APPROVAL_REQUEST,
    PERMISSIONS.APPROVAL_PROCESS,

    // 시스템 모니터링
    PERMISSIONS.SYSTEM_MONITOR,

    // 내부 도구
    PERMISSIONS.INTERNAL_TOOLS,
  ],

  [USER_ROLES.EXTERNAL_USER]: [
    // 기본 데이터 접근
    PERMISSIONS.DATA_READ,
    PERMISSIONS.DATA_CREATE,
    PERMISSIONS.DATA_UPDATE,

    // 기본 보고서
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_EXPORT,

    // 설정 보기
    PERMISSIONS.SETTINGS_VIEW,

    // 승인 요청
    PERMISSIONS.APPROVAL_REQUEST,

    // 외부 API
    PERMISSIONS.EXTERNAL_API,
    PERMISSIONS.EXTERNAL_INTEGRATION,
  ],

  [USER_ROLES.INTERNAL_USER]: [
    // 사용자 조회
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_LIST,

    // 데이터 관리
    PERMISSIONS.DATA_CREATE,
    PERMISSIONS.DATA_READ,
    PERMISSIONS.DATA_UPDATE,
    PERMISSIONS.DATA_EXPORT,

    // 보고서
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_CREATE,
    PERMISSIONS.REPORT_EXPORT,

    // 설정
    PERMISSIONS.SETTINGS_VIEW,

    // 승인 요청
    PERMISSIONS.APPROVAL_REQUEST,

    // 내부 도구
    PERMISSIONS.INTERNAL_TOOLS,
    PERMISSIONS.INTERNAL_ADMIN,
  ],

  [USER_ROLES.USER]: [
    // 기본 데이터 접근
    PERMISSIONS.DATA_READ,

    // 기본 보고서
    PERMISSIONS.REPORT_VIEW,

    // 설정 보기
    PERMISSIONS.SETTINGS_VIEW,

    // 승인 요청
    PERMISSIONS.APPROVAL_REQUEST,
  ],
};

// 역할 계층 정의 (숫자가 높을수록 상위 역할)
const ROLE_HIERARCHY = {
  [USER_ROLES.ADMIN]: 5,
  [USER_ROLES.MANAGER]: 4,
  [USER_ROLES.INTERNAL_USER]: 3,
  [USER_ROLES.EXTERNAL_USER]: 2,
  [USER_ROLES.USER]: 1,
};

const usePermissionStore = create(
  persist(
    (set, get) => ({
      // 상태
      currentUserRole: null,
      customPermissions: [], // 사용자별 추가 권한
      rolePermissions: ROLE_PERMISSIONS,
      loading: false,
      error: null,

      // 사용자 역할 설정
      setUserRole: (role) => {
        if (!Object.values(USER_ROLES).includes(role)) {
          set({ error: `Invalid role: ${role}` });
          return false;
        }

        set({
          currentUserRole: role,
          error: null,
        });
        return true;
      },

      // 사용자별 커스텀 권한 설정
      setCustomPermissions: (permissions) => {
        const validPermissions = permissions.filter((permission) =>
          Object.values(PERMISSIONS).includes(permission)
        );

        set({ customPermissions: validPermissions });
        return validPermissions;
      },

      // 커스텀 권한 추가
      addCustomPermission: (permission) => {
        const { customPermissions } = get();

        if (!Object.values(PERMISSIONS).includes(permission)) {
          set({ error: `Invalid permission: ${permission}` });
          return false;
        }

        if (!customPermissions.includes(permission)) {
          set({
            customPermissions: [...customPermissions, permission],
            error: null,
          });
        }
        return true;
      },

      // 커스텀 권한 제거
      removeCustomPermission: (permission) => {
        const { customPermissions } = get();
        set({
          customPermissions: customPermissions.filter((p) => p !== permission),
        });
      },

      // 현재 사용자의 모든 권한 가져오기
      getAllPermissions: () => {
        const { currentUserRole, customPermissions } = get();

        if (!currentUserRole) return [];

        const rolePermissions = ROLE_PERMISSIONS[currentUserRole] || [];
        const allPermissions = [
          ...new Set([...rolePermissions, ...customPermissions]),
        ];

        return allPermissions;
      },

      // 특정 권한 확인
      hasPermission: (permission) => {
        const allPermissions = get().getAllPermissions();
        return allPermissions.includes(permission);
      },

      // 여러 권한 중 하나라도 가지고 있는지 확인
      hasAnyPermission: (permissions) => {
        const allPermissions = get().getAllPermissions();
        return permissions.some((permission) =>
          allPermissions.includes(permission)
        );
      },

      // 모든 권한을 가지고 있는지 확인
      hasAllPermissions: (permissions) => {
        const allPermissions = get().getAllPermissions();
        return permissions.every((permission) =>
          allPermissions.includes(permission)
        );
      },

      // 역할 기반 권한 확인
      hasRole: (role) => {
        const { currentUserRole } = get();
        return currentUserRole === role;
      },

      // 역할 계층 확인 (현재 역할이 지정된 역할보다 높은지)
      hasRoleLevel: (minRole) => {
        const { currentUserRole } = get();
        if (!currentUserRole) return false;

        const currentLevel = ROLE_HIERARCHY[currentUserRole] || 0;
        const requiredLevel = ROLE_HIERARCHY[minRole] || 0;

        return currentLevel >= requiredLevel;
      },

      // 관리자 권한 확인
      isAdmin: () => {
        return get().hasRole(USER_ROLES.ADMIN);
      },

      // 매니저 이상 권한 확인
      isManagerOrAbove: () => {
        return get().hasRoleLevel(USER_ROLES.MANAGER);
      },

      // 내부 사용자 확인
      isInternalUser: () => {
        const { currentUserRole } = get();
        return [
          USER_ROLES.ADMIN,
          USER_ROLES.MANAGER,
          USER_ROLES.INTERNAL_USER,
        ].includes(currentUserRole);
      },

      // 외부 사용자 확인
      isExternalUser: () => {
        return get().hasRole(USER_ROLES.EXTERNAL_USER);
      },

      // 사용자별 메뉴 권한 확인
      getMenuPermissions: () => {
        const { hasPermission, isAdmin, isManagerOrAbove } = get();

        return {
          dashboard: true, // 모든 사용자
          userManagement: hasPermission(PERMISSIONS.USER_LIST),
          systemConfig: isAdmin(),
          dataManagement: hasPermission(PERMISSIONS.DATA_READ),
          reports: hasPermission(PERMISSIONS.REPORT_VIEW),
          settings: hasPermission(PERMISSIONS.SETTINGS_VIEW),
          approval:
            hasPermission(PERMISSIONS.APPROVAL_REQUEST) ||
            hasPermission(PERMISSIONS.APPROVAL_PROCESS),
          systemLogs: hasPermission(PERMISSIONS.SYSTEM_LOGS),
          externalIntegration: hasPermission(PERMISSIONS.EXTERNAL_API),
          internalTools: hasPermission(PERMISSIONS.INTERNAL_TOOLS),
          advanced: isManagerOrAbove(),
        };
      },

      // 권한 정보 초기화
      clearPermissions: () => {
        set({
          currentUserRole: null,
          customPermissions: [],
          error: null,
        });
      },

      // 에러 클리어
      clearError: () => {
        set({ error: null });
      },

      // 권한 정보 디버깅
      getPermissionInfo: () => {
        const { currentUserRole, customPermissions } = get();
        const allPermissions = get().getAllPermissions();

        return {
          role: currentUserRole,
          roleLevel: ROLE_HIERARCHY[currentUserRole] || 0,
          customPermissions,
          allPermissions,
          permissionCount: allPermissions.length,
          menuPermissions: get().getMenuPermissions(),
        };
      },

      // 권한 검증
      validatePermissions: () => {
        const { currentUserRole, customPermissions } = get();

        const validation = {
          isValid: true,
          errors: [],
        };

        // 역할 유효성 검사
        if (
          currentUserRole &&
          !Object.values(USER_ROLES).includes(currentUserRole)
        ) {
          validation.isValid = false;
          validation.errors.push(`Invalid role: ${currentUserRole}`);
        }

        // 커스텀 권한 유효성 검사
        const invalidPermissions = customPermissions.filter(
          (permission) => !Object.values(PERMISSIONS).includes(permission)
        );

        if (invalidPermissions.length > 0) {
          validation.isValid = false;
          validation.errors.push(
            `Invalid permissions: ${invalidPermissions.join(", ")}`
          );
        }

        return validation;
      },
    }),
    {
      name: "permission-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUserRole: state.currentUserRole,
        customPermissions: state.customPermissions,
      }),
    }
  )
);

export default usePermissionStore;
