import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Task } from "@/types/task";

interface TaskState {
  tasks: Task[];
  toggleTask: (id: string) => void;
  addTask: (task: Omit<Task, "id" | "completed">) => void;
  removeTask: (id: string) => void;
  clearTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: `${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
              completed: false,
            },
          ],
        })),
      removeTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      clearTasks: () => set({ tasks: [] }),
    }),
    {
      name: "dp-tasks",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
