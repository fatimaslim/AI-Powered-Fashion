"use client";

import { motion } from "framer-motion";
import {
  ShirtIcon,
  Footprints,
  ShoppingBag,
  Watch,
  Gem,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/ui/badge";

interface OutfitItem {
  type: string;
  suggestion: string;
  icon: string;
  color: string;
}

const defaultOutfit: OutfitItem[] = [
  {
    type: "Top",
    suggestion: "Slim-fit navy blazer over crisp white Oxford shirt",
    icon: "👔",
    color: "from-blue-500 to-indigo-500",
  },
  {
    type: "Bottom",
    suggestion: "Dark wash straight-leg denim or tailored chinos",
    icon: "👖",
    color: "from-indigo-500 to-violet-500",
  },
  {
    type: "Shoes",
    suggestion: "Clean white leather sneakers or suede desert boots",
    icon: "👟",
    color: "from-amber-500 to-orange-500",
  },
  {
    type: "Bag",
    suggestion: "Structured leather crossbody or minimalist tote",
    icon: "👜",
    color: "from-rose-500 to-pink-500",
  },
  {
    type: "Watch",
    suggestion: "Minimalist silver dial with leather or mesh strap",
    icon: "⌚",
    color: "from-slate-500 to-zinc-500",
  },
  {
    type: "Accessories",
    suggestion: "Simple gold chain necklace and stud earrings",
    icon: "💎",
    color: "from-emerald-500 to-teal-500",
  },
];

const iconMap: Record<string, React.ElementType> = {
  Top: ShirtIcon,
  Bottom: ShirtIcon,
  Shoes: Footprints,
  Bag: ShoppingBag,
  Watch: Watch,
  Accessories: Gem,
};

interface OutfitRecommendationProps {
  items?: OutfitItem[];
}

export default function OutfitRecommendation({
  items = defaultOutfit,
}: OutfitRecommendationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="block">Complete Outfit</span>
              <span className="text-[10px] text-foreground-muted font-normal">
                AI-curated ensemble to complement your look
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {items.map((item, i) => {
              const Icon = iconMap[item.type] || Gem;
              return (
                <motion.div
                  key={item.type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="group"
                >
                  <div className="p-3 rounded-xl border border-border hover:border-brand/30 hover:shadow-md transition-all duration-300 cursor-pointer h-full">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-2.5 group-hover:scale-110 transition-transform shadow-sm`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">{item.icon}</span>
                      <Badge variant="outline" className="text-[9px] px-1.5">
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-foreground-muted leading-relaxed">
                      {item.suggestion}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
