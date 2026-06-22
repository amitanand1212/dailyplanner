export type Priority = "high" | "medium" | "low";
export type Repeat = "none" | "daily" | "weekly";

export interface Task {
  id: string;
  title: string;
  emoji: string;
  dateISO: string; // source of truth, e.g. "2024-05-21"
  time: string; // e.g. "08:00 AM"
  priority: Priority;
  completed: boolean;
  repeat: Repeat;
  notes?: string;
}
