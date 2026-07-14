import { create } from "zustand";

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
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
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
  user: typeof window !== "undefined" && localStorage.getItem("sm_auth") ? DEMO_USER : null,
  isAuthenticated:
    typeof window !== "undefined" && localStorage.getItem("sm_auth") === "true",

  login: async (email: string, password: string) => {
    // Simulated auth — accepts any credentials
    // In production, password would be sent to auth server
    console.log("[Auth] Login attempt:", email, password ? "(password provided)" : "(no password)");
    await new Promise((r) => setTimeout(r, 800));
    const user = { ...DEMO_USER, email };
    if (typeof window !== "undefined") localStorage.setItem("sm_auth", "true");
    set({ user, isAuthenticated: true });
    return true;
  },

  register: async (name: string, email: string, password: string) => {
    // In production, password would be hashed and sent to auth server
    console.log("[Auth] Register:", name, email, password ? "(password set)" : "(no password)");
    await new Promise((r) => setTimeout(r, 800));
    const user = { ...DEMO_USER, name, email };
    if (typeof window !== "undefined") localStorage.setItem("sm_auth", "true");
    set({ user, isAuthenticated: true });
    return true;
  },

  logout: () => {
    if (typeof window !== "undefined") localStorage.removeItem("sm_auth");
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}));
