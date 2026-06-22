import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserState {
  name: string;
  email: string;
  plan: string;
  wakeTime: string;
  sleepTime: string;
  /** Metrics that can't be derived from task data yet. */
  focusTime: string;
  updateUser: (patch: Partial<Omit<UserState, "updateUser" | "reset">>) => void;
  reset: () => void;
}

const DEFAULTS = {
  name: "Friend",
  email: "",
  plan: "Free Plan",
  wakeTime: "07:00 AM",
  sleepTime: "10:30 PM",
  focusTime: "0h 0m",
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      updateUser: (patch) => set(patch),
      reset: () => set({ ...DEFAULTS }),
    }),
    {
      name: "dp-user",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
