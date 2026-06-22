import { useEffect } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { dateToISO, parseTimeToMinutes } from "@/utils/date";
import { taskOccursOn } from "@/utils/recurrence";
import { setupNotifications, syncTaskReminders } from "@/utils/notifications";

/** Surface a reminder for tasks that came due within the last 2 hours. */
const GRACE_MIN = 120;

function checkDueTasks() {
  const now = new Date();
  const today = dateToISO(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const { tasks } = useTaskStore.getState();
  const { push } = useNotificationStore.getState();

  for (const task of tasks) {
    if (task.completed) continue;
    if (!taskOccursOn(task, today)) continue;
    const diff = nowMin - parseTimeToMinutes(task.time);
    if (diff < 0 || diff > GRACE_MIN) continue;
    // push() de-dupes on taskId + dueISO, so repeated ticks are safe.
    push({
      taskId: task.id,
      dueISO: today,
      emoji: task.emoji || "⏰",
      title: task.title,
      body: `Scheduled for ${task.time} today`,
    });
  }
}

/** In-app reminder ticker — runs every 30s while the app is open. */
function useInAppReminders() {
  useEffect(() => {
    checkDueTasks();
    const id = setInterval(checkDueTasks, 30_000);
    return () => clearInterval(id);
  }, []);
}

/** Keep device (system) notifications in sync with the task list. No-op in Expo Go. */
function useDeviceReminderSync() {
  const tasks = useTaskStore((s) => s.tasks);

  useEffect(() => {
    setupNotifications();
  }, []);

  useEffect(() => {
    syncTaskReminders(tasks);
  }, [tasks]);
}

/** Single entry point: wires both in-app reminders and device-notification sync. */
export function useNotifications() {
  useInAppReminders();
  useDeviceReminderSync();
}
