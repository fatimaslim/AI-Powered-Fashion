"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  MessageSquare,
  ShirtIcon,
  Clock,
  Heart,
  Zap,
  TrendingUp,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { staggerContainer, staggerItem } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const stats = [
  { label: "Total Try-Ons", value: "24", icon: Sparkles, change: "+5 this week", color: "text-brand" },
  { label: "Favorites", value: "8", icon: Heart, change: "+2 this week", color: "text-accent" },
  { label: "Credits", value: "47", icon: CreditCard, change: "Pro plan", color: "text-success" },
  { label: "AI Score Avg", value: "88", icon: TrendingUp, change: "+3 points", color: "text-amber-500" },
];

const quickActions = [
  {
    label: "New Try-On",
    description: "Generate a virtual try-on",
    href: "/tryon",
    icon: Sparkles,
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    label: "AI Chat",
    description: "Get fashion advice",
    href: "/chat",
    icon: MessageSquare,
    gradient: "from-violet-500 to-purple-500",
  },
  {
    label: "My Wardrobe",
    description: "Manage your clothes",
    href: "/dashboard/wardrobe",
    icon: ShirtIcon,
    gradient: "from-rose-500 to-pink-500",
  },
  {
    label: "History",
    description: "View past generations",
    href: "/dashboard/history",
    icon: Clock,
    gradient: "from-amber-500 to-orange-500",
  },
];

const recentGenerations = [
  { id: 1, date: "Today, 2:30 PM", score: 92, status: "completed" },
  { id: 2, date: "Today, 11:15 AM", score: 87, status: "completed" },
  { id: 3, date: "Yesterday, 4:45 PM", score: 94, status: "completed" },
  { id: 4, date: "Yesterday, 10:00 AM", score: 85, status: "completed" },
];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold font-[var(--font-plus-jakarta)]">
          Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0] || "User"}</span> 👋
        </h1>
        <p className="text-foreground-muted mt-1">
          Here&apos;s what&apos;s happening with your fashion journey today.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={staggerItem}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                    <Badge variant="outline" className="text-[10px]">{stat.change}</Badge>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-foreground-muted mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={action.href}>
                  <Card className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full">
                    <CardContent className="p-5 flex flex-col h-full">
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-sm">{action.label}</h3>
                      <p className="text-xs text-foreground-muted mt-1">{action.description}</p>
                      <div className="mt-auto pt-3 flex items-center text-xs text-brand font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Open <ArrowRight className="h-3 w-3 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Generations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recent Generations</h2>
          <Link href="/dashboard/history" className="text-sm text-brand hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentGenerations.map((gen) => (
                <div key={gen.id} className="flex items-center justify-between px-5 py-4 hover:bg-background-secondary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Try-On Generation #{gen.id}</p>
                      <p className="text-xs text-foreground-muted">{gen.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={gen.score >= 90 ? "success" : "default"}>
                      Score: {gen.score}
                    </Badge>
                    <Badge variant="outline" className="capitalize">{gen.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="overflow-hidden">
          <div className="relative gradient-brand p-6 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_70%)]" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-white" />
                  <h3 className="text-lg font-bold text-white">Upgrade to Pro</h3>
                </div>
                <p className="text-white/80 text-sm max-w-md">
                  Unlimited try-ons, full AI stylist, outfit scoring, and priority generation.
                </p>
              </div>
              <Button
                variant="secondary"
                className="bg-white text-brand hover:bg-white/90 border-0 shadow-lg flex-shrink-0"
              >
                Upgrade Now
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
