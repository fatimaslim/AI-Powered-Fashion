import { create } from "zustand";
import { useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "pro" | "enterprise";
  credits: number;
  joinedAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  hydrate: () => void;
}

const DEMO_USER: User = {
  id: "user_demo_001",
  name: "Fatima Slim",
  email: "fatima@stylemind.ai",
  plan: "pro",
  credits: 47,
  joinedAt: "2026-06-01",
};

export const useAuthStore = create<AuthState>((set) => ({
  // Start with null — SSR safe. Hydrate on client.
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  hydrate: () => {
    if (typeof window === "undefined") return;
    const authFlag = localStorage.getItem("sm_auth");
    const savedUser = localStorage.getItem("sm_user");
    if (authFlag === "true") {
      const user = savedUser ? JSON.parse(savedUser) : DEMO_USER;
      set({ user, isAuthenticated: true, isHydrated: true });
    } else {
      set({ isHydrated: true });
    }
  },

  login: async (email: string, password: string) => {
    console.log("[Auth] Login attempt:", email, password ? "(password provided)" : "(no password)");
    await new Promise((r) => setTimeout(r, 800));
    const user = { ...DEMO_USER, email };
    if (typeof window !== "undefined") {
      localStorage.setItem("sm_auth", "true");
      localStorage.setItem("sm_user", JSON.stringify(user));
    }
    set({ user, isAuthenticated: true });
    return true;
  },

  register: async (name: string, email: string, password: string) => {
    console.log("[Auth] Register:", name, email, password ? "(password set)" : "(no password)");
    await new Promise((r) => setTimeout(r, 800));
    const user = { ...DEMO_USER, name, email };
    if (typeof window !== "undefined") {
      localStorage.setItem("sm_auth", "true");
      localStorage.setItem("sm_user", JSON.stringify(user));
    }
    set({ user, isAuthenticated: true });
    return true;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("sm_auth");
      localStorage.removeItem("sm_user");
    }
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}));

// Hook to call in layouts — hydrates auth from localStorage on mount
export function useAuthHydration() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) {
      hydrate();
    }
  }, [hydrate, isHydrated]);
}
