import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { message, notification } from "antd";
import dayjs from "dayjs";

// 알림 타입 정의
export const NOTIFICATION_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  SYSTEM: "system",
  APPROVAL: "approval",
  TASK: "task",
  MESSAGE: "message",
};

// 알림 우선순위
export const PRIORITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
};

// 알림 설정 기본값
const DEFAULT_SETTINGS = {
  emailNotifications: true,
  pushNotifications: true,
  weeklyDigest: true,
  soundEnabled: true,
  doNotDisturb: false,
  doNotDisturbStart: "22:00",
  doNotDisturbEnd: "08:00",
  notificationTypes: {
    [NOTIFICATION_TYPES.INFO]: true,
    [NOTIFICATION_TYPES.SUCCESS]: true,
    [NOTIFICATION_TYPES.WARNING]: true,
    [NOTIFICATION_TYPES.ERROR]: true,
    [NOTIFICATION_TYPES.SYSTEM]: true,
    [NOTIFICATION_TYPES.APPROVAL]: true,
    [NOTIFICATION_TYPES.TASK]: true,
    [NOTIFICATION_TYPES.MESSAGE]: true,
  },
  emailFrequency: "instant", // 'instant', 'daily', 'weekly'
  weeklyDigestDay: "monday",
  weeklyDigestTime: "09:00",
};

const useNotificationStore = create(
  persist(
    (set, get) => ({
      // 상태
      notifications: [], // 모든 알림 목록
      unreadCount: 0,
      settings: DEFAULT_SETTINGS,
      emailQueue: [], // 이메일 발송 대기열
      loading: false,
      error: null,

      // Toast 메시지 표시
      showToast: ({ type = "info", message: content, duration = 3 }) => {
        message[type](content, duration);
      },

      // 알림 추가
      addNotification: (notification) => {
        const { notifications, settings, sendEmailNotification } = get();
        const now = dayjs();

        // 방해금지 모드 체크
        if (settings.doNotDisturb) {
          const currentTime = now.format("HH:mm");
          const start = settings.doNotDisturbStart;
          const end = settings.doNotDisturbEnd;

          if (currentTime >= start || currentTime <= end) {
            // 방해금지 시간대에는 긴급 알림만 표시
            if (notification.priority !== PRIORITY_LEVELS.URGENT) {
              return;
            }
          }
        }

        // 새 알림 객체 생성
        const newNotification = {
          id: Date.now(),
          timestamp: now.toISOString(),
          read: false,
          ...notification,
        };

        // 알림 타입이 활성화되어 있는지 확인
        if (!settings.notificationTypes[notification.type]) {
          return;
        }

        // Ant Design 알림 표시
        if (settings.pushNotifications) {
          notification[notification.type || "info"]({
            message: notification.title,
            description: notification.message,
            placement: "topRight",
            duration: 4.5,
          });
        }

        // 알림음 재생 (설정이 활성화된 경우)
        if (
          settings.soundEnabled &&
          notification.priority === PRIORITY_LEVELS.URGENT
        ) {
          const audio = new Audio("/notification-sound.mp3"); // 알림음 파일 경로
          audio
            .play()
            .catch((error) => console.error("알림음 재생 실패:", error));
        }

        // 이메일 알림 처리
        if (settings.emailNotifications) {
          sendEmailNotification(newNotification);
        }

        // 상태 업데이트
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));

        return newNotification;
      },

      // 알림 읽음 처리
      markAsRead: (notificationId) => {
        set((state) => {
          const notifications = state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          );

          return {
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
          };
        });
      },

      // 모든 알림 읽음 처리
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
          unreadCount: 0,
        }));
      },

      // 알림 삭제
      deleteNotification: (notificationId) => {
        set((state) => {
          const notifications = state.notifications.filter(
            (notification) => notification.id !== notificationId
          );

          return {
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
          };
        });
      },

      // 모든 알림 삭제
      clearAllNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      // 알림 설정 업데이트
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        }));
      },

      // 알림 설정 초기화
      resetSettings: () => {
        set({ settings: DEFAULT_SETTINGS });
      },

      // 이메일 알림 발송
      sendEmailNotification: async (notification) => {
        const { settings, emailQueue } = get();

        // 이메일 알림이 비활성화된 경우
        if (!settings.emailNotifications) return;

        // 이메일 발송 빈도에 따른 처리
        switch (settings.emailFrequency) {
          case "instant":
            // 즉시 발송 로직
            try {
              await sendEmail(notification);
            } catch (error) {
              console.error("이메일 발송 실패:", error);
              // 실패한 경우 큐에 추가
              set({ emailQueue: [...emailQueue, notification] });
            }
            break;

          case "daily":
          case "weekly":
            // 큐에 추가
            set({ emailQueue: [...emailQueue, notification] });
            break;
        }
      },

      // 주간 알림 다이제스트 발송
      sendWeeklyDigest: async () => {
        const { notifications, settings } = get();
        if (!settings.weeklyDigest) return;

        const weekStart = dayjs().startOf("week");
        const weeklyNotifications = notifications.filter((notification) =>
          dayjs(notification.timestamp).isAfter(weekStart)
        );

        if (weeklyNotifications.length === 0) return;

        try {
          await sendEmail({
            type: "weekly-digest",
            title: "주간 알림 다이제스트",
            message: `이번 주의 알림 ${weeklyNotifications.length}건이 있습니다.`,
            notifications: weeklyNotifications,
          });
        } catch (error) {
          console.error("주간 다이제스트 발송 실패:", error);
        }
      },

      // 읽지 않은 알림 필터링
      getUnreadNotifications: () => {
        const { notifications } = get();
        return notifications.filter((notification) => !notification.read);
      },

      // 알림 타입별 필터링
      getNotificationsByType: (type) => {
        const { notifications } = get();
        return notifications.filter(
          (notification) => notification.type === type
        );
      },

      // 기간별 알림 필터링
      getNotificationsByPeriod: (startDate, endDate) => {
        const { notifications } = get();
        return notifications.filter((notification) => {
          const timestamp = dayjs(notification.timestamp);
          return timestamp.isAfter(startDate) && timestamp.isBefore(endDate);
        });
      },

      // 우선순위별 알림 필터링
      getNotificationsByPriority: (priority) => {
        const { notifications } = get();
        return notifications.filter(
          (notification) => notification.priority === priority
        );
      },

      // 이메일 큐 처리
      processEmailQueue: async () => {
        const { emailQueue } = get();
        if (emailQueue.length === 0) return;

        try {
          // 이메일 일괄 발송 로직
          await sendBulkEmails(emailQueue);
          set({ emailQueue: [] });
        } catch (error) {
          console.error("이메일 큐 처리 실패:", error);
        }
      },
    }),
    {
      name: "notification-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        settings: state.settings,
        unreadCount: state.unreadCount,
      }),
    }
  )
);

// 이메일 발송 함수 (실제 구현 필요)
const sendEmail = async (notification) => {
  // 실제 이메일 발송 API 호출
  // const response = await fetch('/api/notifications/email', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(notification)
  // });
  // return response.json();

  // 임시 구현
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("이메일 발송:", notification);
      resolve({ success: true });
    }, 1000);
  });
};

// 이메일 일괄 발송 함수 (실제 구현 필요)
const sendBulkEmails = async (notifications) => {
  // 실제 일괄 이메일 발송 API 호출
  // const response = await fetch('/api/notifications/bulk-email', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ notifications })
  // });
  // return response.json();

  // 임시 구현
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("일괄 이메일 발송:", notifications);
      resolve({ success: true });
    }, 1000);
  });
};

export default useNotificationStore;
