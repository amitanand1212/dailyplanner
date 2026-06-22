export interface AppNotification {
  id: string;
  taskId?: string;
  dueISO?: string; // the task date this reminder is for (used to de-dupe)
  emoji: string;
  title: string;
  body: string;
  createdAt: number; // epoch ms
  read: boolean;
}
