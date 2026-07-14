"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Moon, Sun, Key, Bell, Shield, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { useTryOnStore } from "@/store/tryon-store";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const apiKey = useTryOnStore((s) => s.apiKey);
  const setApiKey = useTryOnStore((s) => s.setApiKey);
  const [tempKey, setTempKey] = useState(apiKey);
  const [defaultMode, setDefaultMode] = useState("Balanced");
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-[var(--font-plus-jakarta)]">
          <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-foreground-muted text-sm mt-1">
          Manage your preferences and account settings.
        </p>
      </motion.div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="h-4 w-4 text-brand" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel of the app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-foreground-muted">Choose between light and dark mode</p>
            </div>
            <div className="flex gap-2">
              {[
                { value: "light", icon: Sun, label: "Light" },
                { value: "dark", icon: Moon, label: "Dark" },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      theme === opt.value
                        ? "gradient-brand text-white shadow-md"
                        : "bg-background-secondary text-foreground-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Key */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Key className="h-4 w-4 text-brand" />
            API Configuration
          </CardTitle>
          <CardDescription>Manage your FASHN API key for virtual try-on.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="Enter your FASHN API key..."
              className="flex-1 h-10 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
            <Button
              size="sm"
              onClick={() => setApiKey(tempKey)}
            >
              Save Key
            </Button>
          </div>
          <p className="text-xs text-foreground-muted mt-2">
            Get your key from{" "}
            <a href="https://app.fashn.ai" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
              app.fashn.ai
            </a>
          </p>
        </CardContent>
      </Card>

      {/* Generation Defaults */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="h-4 w-4 text-brand" />
            Generation Defaults
          </CardTitle>
          <CardDescription>Set your preferred default settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Default Quality Mode</p>
              <p className="text-xs text-foreground-muted">Applied to new try-on generations</p>
            </div>
            <div className="flex gap-1.5">
              {["Performance", "Balanced", "Quality"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDefaultMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    defaultMode === mode
                      ? "gradient-brand text-white shadow-sm"
                      : "bg-background-secondary text-foreground-muted"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-brand" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-foreground-muted">Receive updates about new features and tips</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                notifications ? "bg-brand" : "bg-border"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                  notifications ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-error/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-error">
            <Shield className="h-4 w-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Delete Account</p>
            <p className="text-xs text-foreground-muted">Permanently delete your account and data</p>
          </div>
          <Button variant="danger" size="sm">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
