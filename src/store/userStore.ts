import { create } from "zustand";

export interface User {
  id: string;
  role: "admin" | "applicant";
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("loggedInUser");
    set({ user: null });
  },
}));
