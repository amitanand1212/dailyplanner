import type { Task } from "@/types/task";
import { isoToDate } from "@/utils/date";

/**
 * Does a task occur on the given ISO date?
 * - "none": only on its own date
 * - "daily": every day on/after its start date
 * - "weekly": same weekday on/after its start date
 */
export function taskOccursOn(task: Task, iso: string): boolean {
  if (iso < task.dateISO) return false;
  if (task.repeat === "daily") return true;
  if (task.repeat === "weekly") {
    return isoToDate(iso).getDay() === isoToDate(task.dateISO).getDay();
  }
  return iso === task.dateISO;
}
