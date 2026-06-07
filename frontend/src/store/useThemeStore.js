import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chatwave-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("chatwave-theme", theme);
    set({ theme });
  },
}));
