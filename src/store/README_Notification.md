# 알림 관리 시스템 (Notification Management System)

Zustand와 Ant Design을 기반으로 한 알림 관리 시스템입니다.

## 📚 주요 기능

### 1. Toast & 알림

- Ant Design의 message와 notification 컴포넌트 활용
- 다양한 알림 타입 지원 (info, success, warning, error 등)
- 우선순위 기반 알림 처리
- 알림음 지원 (긴급 알림)

### 2. 알림 큐 관리

- 읽음/안읽음 상태 관리
- 알림 필터링 (타입, 기간, 우선순위별)
- 알림 삭제 및 일괄 삭제
- 알림 히스토리 관리

### 3. 이메일 알림

- 즉시/일간/주간 발송 옵션
- 이메일 큐 관리
- 주간 다이제스트 발송
- 실패한 이메일 재시도

### 4. 알림 설정

- 알림 타입별 활성화/비활성화
- 방해금지 시간 설정
- 이메일 수신 빈도 설정
- 알림음 설정

## 💻 기본 사용법

### 1. 스토어 import

```jsx
import useNotificationStore, {
  NOTIFICATION_TYPES,
  PRIORITY_LEVELS,
} from "./store/NotificationStore";
```

### 2. Toast 메시지 표시

```jsx
function MyComponent() {
  const { showToast } = useNotificationStore();

  const handleSuccess = () => {
    showToast({
      type: "success",
      message: "작업이 완료되었습니다.",
      duration: 3,
    });
  };

  return <button onClick={handleSuccess}>작업 완료</button>;
}
```

### 3. 알림 추가

```jsx
function NotificationExample() {
  const { addNotification } = useNotificationStore();

  const sendNotification = () => {
    addNotification({
      type: NOTIFICATION_TYPES.TASK,
      title: "새로운 작업",
      message: "새로운 작업이 할당되었습니다.",
      priority: PRIORITY_LEVELS.HIGH,
    });
  };

  return <button onClick={sendNotification}>알림 보내기</button>;
}
```

### 4. 알림 목록 표시

```jsx
function NotificationList() {
  const { notifications, unreadCount, markAsRead, deleteNotification } =
    useNotificationStore();

  return (
    <div>
      <h2>알림 ({unreadCount})</h2>
      {notifications.map((notification) => (
        <div key={notification.id}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
          {!notification.read && (
            <button onClick={() => markAsRead(notification.id)}>
              읽음 표시
            </button>
          )}
          <button onClick={() => deleteNotification(notification.id)}>
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 5. 알림 설정 관리

```jsx
function NotificationSettings() {
  const { settings, updateSettings } = useNotificationStore();

  const handleSettingChange = (key, value) => {
    updateSettings({ [key]: value });
  };

  return (
    <div>
      <h2>알림 설정</h2>

      <div>
        <label>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) =>
              handleSettingChange("emailNotifications", e.target.checked)
            }
          />
          이메일 알림
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={settings.pushNotifications}
            onChange={(e) =>
              handleSettingChange("pushNotifications", e.target.checked)
            }
          />
          푸시 알림
        </label>
      </div>

      <div>
        <label>방해금지 모드</label>
        <input
          type="checkbox"
          checked={settings.doNotDisturb}
          onChange={(e) =>
            handleSettingChange("doNotDisturb", e.target.checked)
          }
        />
        {settings.doNotDisturb && (
          <>
            <input
              type="time"
              value={settings.doNotDisturbStart}
              onChange={(e) =>
                handleSettingChange("doNotDisturbStart", e.target.value)
              }
            />
            ~
            <input
              type="time"
              value={settings.doNotDisturbEnd}
              onChange={(e) =>
                handleSettingChange("doNotDisturbEnd", e.target.value)
              }
            />
          </>
        )}
      </div>

      <div>
        <label>이메일 수신 빈도</label>
        <select
          value={settings.emailFrequency}
          onChange={(e) =>
            handleSettingChange("emailFrequency", e.target.value)
          }
        >
          <option value="instant">즉시</option>
          <option value="daily">일간</option>
          <option value="weekly">주간</option>
        </select>
      </div>
    </div>
  );
}
```

## 🔍 알림 필터링

### 1. 읽지 않은 알림

```jsx
const { getUnreadNotifications } = useNotificationStore();
const unreadNotifications = getUnreadNotifications();
```

### 2. 타입별 알림

```jsx
const { getNotificationsByType } = useNotificationStore();
const taskNotifications = getNotificationsByType(NOTIFICATION_TYPES.TASK);
```

### 3. 기간별 알림

```jsx
const { getNotificationsByPeriod } = useNotificationStore();
const startDate = dayjs().subtract(1, "week");
const endDate = dayjs();
const weeklyNotifications = getNotificationsByPeriod(startDate, endDate);
```

### 4. 우선순위별 알림

```jsx
const { getNotificationsByPriority } = useNotificationStore();
const urgentNotifications = getNotificationsByPriority(PRIORITY_LEVELS.URGENT);
```

## 📧 이메일 알림 설정

### 1. 이메일 알림 활성화

```jsx
const { updateSettings } = useNotificationStore();

// 이메일 알림 활성화
updateSettings({
  emailNotifications: true,
  emailFrequency: "daily",
});
```

### 2. 주간 다이제스트 설정

```jsx
updateSettings({
  weeklyDigest: true,
  weeklyDigestDay: "monday",
  weeklyDigestTime: "09:00",
});
```

## 🎯 알림 타입별 설정

```jsx
const { updateSettings } = useNotificationStore();

// 특정 알림 타입만 활성화
updateSettings({
  notificationTypes: {
    [NOTIFICATION_TYPES.TASK]: true,
    [NOTIFICATION_TYPES.APPROVAL]: true,
    [NOTIFICATION_TYPES.SYSTEM]: false,
    [NOTIFICATION_TYPES.MESSAGE]: true,
  },
});
```

## 🔔 알림 우선순위

```javascript
// 우선순위 레벨
PRIORITY_LEVELS.LOW; // 낮음
PRIORITY_LEVELS.MEDIUM; // 중간
PRIORITY_LEVELS.HIGH; // 높음
PRIORITY_LEVELS.URGENT; // 긴급
```

## 📱 방해금지 모드

```jsx
// 방해금지 모드 설정
updateSettings({
  doNotDisturb: true,
  doNotDisturbStart: "22:00",
  doNotDisturbEnd: "08:00",
});
```

## 🔄 자동 동기화

- localStorage를 통한 알림 상태 자동 저장
- 브라우저 새로고침 시에도 알림 상태 유지
- 알림 설정 자동 저장

## 🛠️ 커스터마이징

### 1. 새로운 알림 타입 추가

```javascript
// NOTIFICATION_TYPES에 새로운 타입 추가
export const NOTIFICATION_TYPES = {
  ...NOTIFICATION_TYPES,
  CUSTOM: "custom",
};

// 기본 설정에 새로운 타입 추가
const DEFAULT_SETTINGS = {
  ...DEFAULT_SETTINGS,
  notificationTypes: {
    ...DEFAULT_SETTINGS.notificationTypes,
    [NOTIFICATION_TYPES.CUSTOM]: true,
  },
};
```

### 2. 알림 스타일 커스터마이징

```jsx
// Ant Design notification 스타일 커스터마이징
notification.config({
  placement: "topRight",
  duration: 4.5,
  maxCount: 5,
});
```

## 🚀 실제 API 연동

### 1. 이메일 발송 함수 구현

```javascript
const sendEmail = async (notification) => {
  const response = await fetch("/api/notifications/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(notification),
  });
  return response.json();
};
```

### 2. 일괄 이메일 발송 구현

```javascript
const sendBulkEmails = async (notifications) => {
  const response = await fetch("/api/notifications/bulk-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notifications }),
  });
  return response.json();
};
```

이 알림 관리 시스템을 통해 사용자 친화적이고 확장 가능한 알림 기능을 구현할 수 있습니다.
