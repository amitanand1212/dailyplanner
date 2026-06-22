import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppNotification } from "@/types/notification";

interface NotificationState {
  notifications: AppNotification[];
  /** The most recent notification to surface as a live banner (transient). */
  banner: AppNotification | null;
  push: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  clearAll: () => void;
  dismissBanner: () => void;
}

const MAX_KEPT = 100;

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      banner: null,

      push: (n) => {
        // De-dupe: same task + same due date shouldn't fire twice.
        if (
          n.taskId &&
          n.dueISO &&
          get().notifications.some(
            (x) => x.taskId === n.taskId && x.dueISO === n.dueISO
          )
        ) {
          return;
        }
        const item: AppNotification = {
          ...n,
          id: `${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
          createdAt: Date.now(),
          read: false,
        };
        set((state) => ({
          notifications: [item, ...state.notifications].slice(0, MAX_KEPT),
          banner: item,
        }));
      },

      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      remove: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearAll: () => set({ notifications: [], banner: null }),

      dismissBanner: () => set({ banner: null }),
    }),
    {
      name: "dp-notifications",
      storage: createJSONStorage(() => AsyncStorage),
      // Don't persist the transient banner.
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
);

/** Unread count selector helper. */
export const selectUnreadCount = (s: NotificationState) =>
  s.notifications.reduce((acc, n) => acc + (n.read ? 0 : 1), 0);
