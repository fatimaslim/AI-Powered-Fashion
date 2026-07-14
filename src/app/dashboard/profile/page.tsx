"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Calendar,
  Award,
  Sparkles,
  Heart,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  const profileStats = [
    { label: "Total Generations", value: "24", icon: Sparkles, color: "text-brand" },
    { label: "Favorites", value: "8", icon: Heart, color: "text-accent" },
    { label: "Avg Score", value: "88", icon: TrendingUp, color: "text-success" },
    { label: "Member Since", value: "Jun 2026", icon: Calendar, color: "text-amber-500" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-[var(--font-plus-jakarta)]">
          My <span className="gradient-text">Profile</span>
        </h1>
      </motion.div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl gradient-brand flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-brand/20">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold">{user?.name || "User"}</h2>
              <div className="flex items-center gap-2 justify-center sm:justify-start mt-1">
                <Mail className="h-4 w-4 text-foreground-muted" />
                <p className="text-foreground-muted text-sm">{user?.email || "user@email.com"}</p>
              </div>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <Badge variant="brand" className="gap-1">
                  <Award className="h-3 w-3" />
                  {user?.plan === "pro" ? "Pro Member" : "Free Plan"}
                </Badge>
                <Badge variant="outline">{user?.credits || 0} credits</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {profileStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <Icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-foreground-muted mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Generated virtual try-on", time: "2 hours ago", icon: "✨" },
              { action: "Saved outfit to Favorites", time: "5 hours ago", icon: "❤️" },
              { action: "Used AI Fashion Chat", time: "1 day ago", icon: "💬" },
              { action: "Added item to Wardrobe", time: "2 days ago", icon: "👕" },
              { action: "Received AI Stylist analysis", time: "3 days ago", icon: "🎨" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="text-lg">{activity.icon}</span>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                </div>
                <p className="text-xs text-foreground-muted">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
