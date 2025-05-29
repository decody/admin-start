# 권한 관리 시스템 (Permission Management System)

이 프로젝트는 Zustand를 기반으로 한 체계적인 권한 관리 시스템을 제공합니다.

## 📁 파일 구조

```
src/store/
├── AuthStore.js          # 인증 관리 스토어
├── PermissionStore.js    # 권한 관리 스토어
├── README.md            # AuthStore 사용 가이드
└── README_Permission.md  # 권한 시스템 가이드 (이 파일)
```

## 🏗️ 시스템 아키텍처

### 1. 역할 기반 접근 제어 (RBAC)

- **5단계 사용자 역할**: admin, manager, internal, external, user
- **계층적 권한 구조**: 상위 역할이 하위 역할의 권한을 포함
- **세분화된 권한**: 26개의 구체적인 권한 정의

### 2. 스토어 연동

- **AuthStore**: 인증 상태 관리 + 권한 시스템 연동
- **PermissionStore**: 순수 권한 로직 관리
- **자동 동기화**: 로그인/로그아웃 시 권한 정보 자동 연동

## 👥 사용자 역할 (USER_ROLES)

| 역할       | 코드       | 레벨 | 설명                     |
| ---------- | ---------- | ---- | ------------------------ |
| 관리자     | `admin`    | 5    | 시스템 전체 권한         |
| 매니저     | `manager`  | 4    | 관리 업무 및 승인 권한   |
| 내부사용자 | `internal` | 3    | 내부 시스템 접근 권한    |
| 외부사용자 | `external` | 2    | 외부 연동 및 제한적 접근 |
| 일반유저   | `user`     | 1    | 기본 조회 권한           |

## 🔐 권한 카테고리 (PERMISSIONS)

### 사용자 관리 (`user:*`)

- `USER_CREATE`: 사용자 생성
- `USER_READ`: 사용자 조회
- `USER_UPDATE`: 사용자 수정
- `USER_DELETE`: 사용자 삭제
- `USER_LIST`: 사용자 목록 조회

### 시스템 관리 (`system:*`)

- `SYSTEM_CONFIG`: 시스템 설정
- `SYSTEM_LOGS`: 시스템 로그 조회
- `SYSTEM_BACKUP`: 백업 관리
- `SYSTEM_MONITOR`: 시스템 모니터링

### 데이터 관리 (`data:*`)

- `DATA_CREATE`: 데이터 생성
- `DATA_READ`: 데이터 조회
- `DATA_UPDATE`: 데이터 수정
- `DATA_DELETE`: 데이터 삭제
- `DATA_EXPORT`: 데이터 내보내기
- `DATA_IMPORT`: 데이터 가져오기

### 보고서 (`report:*`)

- `REPORT_VIEW`: 보고서 조회
- `REPORT_CREATE`: 보고서 생성
- `REPORT_EXPORT`: 보고서 내보내기
- `REPORT_ADVANCED`: 고급 보고서

### 설정 (`settings:*`)

- `SETTINGS_VIEW`: 설정 조회
- `SETTINGS_EDIT`: 설정 수정

### 승인/결재 (`approval:*`)

- `APPROVAL_REQUEST`: 승인 요청
- `APPROVAL_PROCESS`: 승인 처리
- `APPROVAL_ADMIN`: 승인 관리

### 외부 연동 (`external:*`)

- `EXTERNAL_API`: 외부 API 접근
- `EXTERNAL_INTEGRATION`: 외부 시스템 연동

### 내부 시스템 (`internal:*`)

- `INTERNAL_TOOLS`: 내부 도구 접근
- `INTERNAL_ADMIN`: 내부 시스템 관리

## 💻 기본 사용법

### 1. 스토어 import

```jsx
import useAuthStore from "./store/AuthStore";
import usePermissionStore, {
  USER_ROLES,
  PERMISSIONS,
} from "./store/PermissionStore";
```

### 2. 로그인 및 권한 설정

```jsx
function LoginComponent() {
  const { login, loginWithRole } = useAuthStore();
  const { currentUserRole, hasPermission } = usePermissionStore();

  // 일반 로그인
  const handleLogin = async () => {
    const result = await login({ email: "admin@test.com", password: "123456" });
    if (result.success) {
      console.log("로그인 성공:", result.user);
    }
  };

  // 역할별 테스트 로그인
  const handleRoleLogin = async (role) => {
    const result = await loginWithRole(role);
    if (result.success) {
      console.log(`${role} 역할로 로그인 성공`);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>일반 로그인</button>
      <button onClick={() => handleRoleLogin("admin")}>관리자 로그인</button>
      <button onClick={() => handleRoleLogin("manager")}>매니저 로그인</button>
      <button onClick={() => handleRoleLogin("internal")}>
        내부사용자 로그인
      </button>
      <button onClick={() => handleRoleLogin("external")}>
        외부사용자 로그인
      </button>
      <button onClick={() => handleRoleLogin("user")}>일반유저 로그인</button>
    </div>
  );
}
```

### 3. 권한 기반 UI 렌더링

```jsx
function DashboardComponent() {
  const { hasPermission, isAdmin, getMenuPermissions } = usePermissionStore();
  const menuPermissions = getMenuPermissions();

  return (
    <div>
      <h1>대시보드</h1>

      {/* 개별 권한 확인 */}
      {hasPermission(PERMISSIONS.USER_LIST) && <button>사용자 관리</button>}

      {/* 관리자 권한 확인 */}
      {isAdmin() && <button>시스템 설정</button>}

      {/* 메뉴 권한 객체 사용 */}
      {menuPermissions.dataManagement && <button>데이터 관리</button>}

      {menuPermissions.reports && <button>보고서</button>}
    </div>
  );
}
```

### 4. 컴포넌트 보호 (HOC)

```jsx
const withPermission = (WrappedComponent, requiredPermissions) => {
  return (props) => {
    const { hasAllPermissions } = usePermissionStore();

    if (!hasAllPermissions(requiredPermissions)) {
      return (
        <div className="unauthorized">
          <h2>접근 권한이 없습니다</h2>
          <p>이 페이지에 접근하기 위한 권한이 부족합니다.</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

// 사용 예시
const ProtectedUserManagement = withPermission(UserManagementComponent, [
  PERMISSIONS.USER_LIST,
  PERMISSIONS.USER_CREATE,
]);
```

### 5. 라우터 가드

```jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  requiredPermission,
  requiredRole,
  minRoleLevel,
}) => {
  const { hasPermission, hasRole, hasRoleLevel } = usePermissionStore();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" />;
  }

  if (minRoleLevel && !hasRoleLevel(minRoleLevel)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

// 라우터 설정 예시
<Routes>
  <Route path="/dashboard" element={<DashboardComponent />} />

  <Route
    path="/users"
    element={
      <ProtectedRoute requiredPermission={PERMISSIONS.USER_LIST}>
        <UserManagementComponent />
      </ProtectedRoute>
    }
  />

  <Route
    path="/admin"
    element={
      <ProtectedRoute minRoleLevel={USER_ROLES.MANAGER}>
        <AdminComponent />
      </ProtectedRoute>
    }
  />
</Routes>;
```

## 🔍 디버깅 및 모니터링

### 권한 정보 확인

```jsx
function DebugComponent() {
  const { getPermissionInfo, validatePermissions } = usePermissionStore();

  const showPermissionInfo = () => {
    const info = getPermissionInfo();
    console.log("=== 권한 정보 ===");
    console.log("역할:", info.role);
    console.log("역할 레벨:", info.roleLevel);
    console.log("커스텀 권한:", info.customPermissions);
    console.log("전체 권한 수:", info.permissionCount);
    console.log("메뉴 권한:", info.menuPermissions);
    console.log("모든 권한:", info.allPermissions);
  };

  const validateCurrentPermissions = () => {
    const validation = validatePermissions();
    if (validation.isValid) {
      console.log("✅ 권한 설정이 유효합니다.");
    } else {
      console.error("❌ 권한 설정 오류:", validation.errors);
    }
  };

  return (
    <div>
      <button onClick={showPermissionInfo}>권한 정보 출력</button>
      <button onClick={validateCurrentPermissions}>권한 검증</button>
    </div>
  );
}
```

## 📊 역할별 권한 매트릭스

| 기능 영역            | 일반유저 | 외부사용자 | 내부사용자 | 매니저 | 관리자 |
| -------------------- | -------- | ---------- | ---------- | ------ | ------ |
| **대시보드**         | ✅       | ✅         | ✅         | ✅     | ✅     |
| **데이터 조회**      | ✅       | ✅         | ✅         | ✅     | ✅     |
| **데이터 생성/수정** | ❌       | ✅         | ✅         | ✅     | ✅     |
| **데이터 삭제**      | ❌       | ❌         | ❌         | ❌     | ✅     |
| **사용자 조회**      | ❌       | ❌         | ✅         | ✅     | ✅     |
| **사용자 관리**      | ❌       | ❌         | ❌         | ✅     | ✅     |
| **사용자 삭제**      | ❌       | ❌         | ❌         | ❌     | ✅     |
| **기본 보고서**      | ✅       | ✅         | ✅         | ✅     | ✅     |
| **고급 보고서**      | ❌       | ❌         | ❌         | ✅     | ✅     |
| **설정 조회**        | ✅       | ✅         | ✅         | ✅     | ✅     |
| **설정 수정**        | ❌       | ❌         | ❌         | ✅     | ✅     |
| **승인 요청**        | ✅       | ✅         | ✅         | ✅     | ✅     |
| **승인 처리**        | ❌       | ❌         | ❌         | ✅     | ✅     |
| **시스템 설정**      | ❌       | ❌         | ❌         | ❌     | ✅     |
| **시스템 로그**      | ❌       | ❌         | ❌         | ❌     | ✅     |
| **외부 API**         | ❌       | ✅         | ❌         | ❌     | ✅     |
| **내부 도구**        | ❌       | ❌         | ✅         | ✅     | ✅     |

## 🚀 실제 API 연동

### 1. AuthStore의 login 함수 수정

```javascript
login: async (credentials) => {
  set({ loading: true, error: null });

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "로그인 실패");
    }

    const { user, token, refreshToken } = data;

    set({
      isAuthenticated: true,
      user,
      token,
      refreshToken,
      loading: false,
      error: null,
    });

    // 권한 설정
    const { setUserRole, setCustomPermissions } = usePermissionStore.getState();
    setUserRole(user.role);
    if (user.permissions) {
      setCustomPermissions(user.permissions);
    }

    return { success: true, user };
  } catch (error) {
    set({
      loading: false,
      error: error.message,
    });
    return { success: false, error: error.message };
  }
};
```

### 2. API 응답 예시

```json
{
  "success": true,
  "user": {
    "id": 123,
    "email": "manager@company.com",
    "name": "김매니저",
    "role": "manager",
    "permissions": ["SPECIAL_FEATURE_1", "SPECIAL_FEATURE_2"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here"
}
```

## 🛠️ 커스터마이징

### 새로운 권한 추가

1. `PERMISSIONS` 객체에 새 권한 추가
2. `ROLE_PERMISSIONS`에서 역할별 권한 매핑 업데이트
3. 필요시 새로운 유틸리티 함수 추가

### 새로운 역할 추가

1. `USER_ROLES` 객체에 새 역할 추가
2. `ROLE_HIERARCHY`에 역할 레벨 설정
3. `ROLE_PERMISSIONS`에 역할별 권한 정의

이 권한 관리 시스템을 통해 확장 가능하고 유지보수가 용이한 접근 제어를 구현할 수 있습니다.
