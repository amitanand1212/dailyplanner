import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import type { Task } from "@/types/task";
import { isoToDate, parseTime } from "@/utils/date";

/** Expo Go can't fire scheduled local notifications reliably (needs a dev build). */
export const isExpoGo = Constants.appOwnership === "expo";

let handlerSet = false;

/** Set the foreground handler + Android channel + request permission. Safe to call repeatedly. */
export async function setupNotifications(): Promise<boolean> {
  try {
    if (!handlerSet) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
      handlerSet = true;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("reminders", {
        name: "Task Reminders",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#6C5CE7",
      });
    }

    let { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      status = (await Notifications.requestPermissionsAsync()).status;
    }
    return status === "granted";
  } catch {
    return false;
  }
}

function triggerForTask(task: Task): Notifications.NotificationTriggerInput | null {
  const { hour, minute } = parseTime(task.time);

  if (task.repeat === "daily") {
    return { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute };
  }
  if (task.repeat === "weekly") {
    const weekday = isoToDate(task.dateISO).getDay() + 1; // expo: 1=Sun .. 7=Sat
    return {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday,
      hour,
      minute,
    };
  }

  // one-time: only if still in the future
  const d = isoToDate(task.dateISO);
  d.setHours(hour, minute, 0, 0);
  if (d.getTime() <= Date.now()) return null;
  return { type: Notifications.SchedulableTriggerInputTypes.DATE, date: d };
}

export async function scheduleTaskReminder(task: Task) {
  if (isExpoGo || task.completed) return;
  try {
    const trigger = triggerForTask(task);
    if (!trigger) return;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${task.emoji} ${task.title}`,
        body: `It's time for "${task.title}"`,
        data: { taskId: task.id },
        sound: true,
      },
      trigger,
    });
  } catch {
    // no-op
  }
}

export async function cancelTaskReminder(taskId: string) {
  if (isExpoGo) return;
  try {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
      all
        .filter((n) => n.content.data?.taskId === taskId)
        .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
    );
  } catch {
    // no-op
  }
}

/** Cancel everything and reschedule from the current task list. */
export async function syncTaskReminders(tasks: Task[]) {
  if (isExpoGo) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Promise.all(tasks.filter((t) => !t.completed).map(scheduleTaskReminder));
  } catch {
    // no-op
  }
}
