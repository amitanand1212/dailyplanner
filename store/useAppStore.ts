import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppState {
  hasOnboarded: boolean;
  completeOnboarding: () => void;
  setOnboarded: (value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      completeOnboarding: () => set({ hasOnboarded: true }),
      setOnboarded: (value) => set({ hasOnboarded: value }),
    }),
    {
      name: "dp-app",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
