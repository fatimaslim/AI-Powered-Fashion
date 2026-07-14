"use client";

import { motion } from "framer-motion";
import { Clock, Sparkles, Download, Trash2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { staggerContainer, staggerItem } from "@/lib/utils";

const historyItems = [
  { id: 1, date: "July 13, 2026 — 2:30 PM", score: 92, mode: "Quality", category: "Top" },
  { id: 2, date: "July 13, 2026 — 11:15 AM", score: 87, mode: "Balanced", category: "Full-body" },
  { id: 3, date: "July 12, 2026 — 4:45 PM", score: 94, mode: "Quality", category: "Top" },
  { id: 4, date: "July 12, 2026 — 10:00 AM", score: 85, mode: "Performance", category: "Bottom" },
  { id: 5, date: "July 11, 2026 — 3:20 PM", score: 91, mode: "Quality", category: "Top" },
  { id: 6, date: "July 11, 2026 — 9:30 AM", score: 88, mode: "Balanced", category: "Full-body" },
  { id: 7, date: "July 10, 2026 — 5:15 PM", score: 90, mode: "Quality", category: "Top" },
  { id: 8, date: "July 10, 2026 — 1:00 PM", score: 83, mode: "Performance", category: "Bottom" },
];

export default function HistoryPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-[var(--font-plus-jakarta)]">
          Generation <span className="gradient-text">History</span>
        </h1>
        <p className="text-foreground-muted text-sm mt-1">
          View and manage all your past virtual try-on generations.
        </p>
      </motion.div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search generations..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div className="flex gap-2">
          {["All", "Top", "Bottom", "Full-body"].map((filter) => (
            <button
              key={filter}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-background-secondary hover:bg-border transition-colors cursor-pointer"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* History list */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {historyItems.map((item) => (
          <motion.div key={item.id} variants={staggerItem}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand/10 to-brand-secondary/10 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-brand" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">Try-On #{item.id}</p>
                        <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-foreground-muted" />
                        <p className="text-xs text-foreground-muted">{item.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={item.score >= 90 ? "success" : "default"}>
                      Score: {item.score}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">{item.mode}</Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground-muted hover:text-error">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
