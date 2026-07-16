"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  MessageSquare,
  ShirtIcon,
  Clock,
  Heart,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import Logo from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { useAuthStore, useAuthHydration } from "@/store/auth-store";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Try-On", href: "/tryon", icon: Sparkles },
  { label: "AI Chat", href: "/chat", icon: MessageSquare },
  { label: "Wardrobe", href: "/dashboard/wardrobe", icon: ShirtIcon },
  { label: "History", href: "/dashboard/history", icon: Clock },
  { label: "Favorites", href: "/dashboard/favorites", icon: Heart },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // Hydrate auth state from localStorage on mount
  useAuthHydration();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-40">
        <div className="flex flex-col flex-1 border-r border-border bg-card">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Logo size="md" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "gradient-brand text-white shadow-md shadow-brand/20"
                      : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name || "User"}</p>
                <p className="text-xs text-foreground-muted truncate">{user?.email || ""}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-foreground-muted hover:text-error hover:bg-error/5 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 glass-strong border-b border-border flex items-center justify-between px-4">
        <Logo size="sm" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-background-secondary transition-colors cursor-pointer"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-72 h-full bg-card border-r border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border">
                <Logo size="md" />
              </div>
              <nav className="p-4 space-y-1">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "gradient-brand text-white"
                          : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
                      )}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      {link.label}
                      {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
