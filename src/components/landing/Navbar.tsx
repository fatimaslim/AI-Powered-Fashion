"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/brand/Logo";
import Button from "@/components/ui/button";
import Link from "next/link";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Technology", href: "#technology" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle nav link click — smooth scroll on home, navigate on other pages
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileOpen(false);

    if (pathname === "/") {
      // We're on the landing page — smooth scroll to section
      const sectionId = href.replace("#", "");
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // We're on another page — navigate to home + hash
      router.push("/" + href);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || pathname !== "/"
            ? "glass-strong shadow-lg bg-background/95 border-b border-border/40"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Logo size="md" />

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-2 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors rounded-lg hover:bg-background-secondary cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
              <Link href="/hijab-studio" className="px-3 py-2 text-sm font-medium text-brand hover:text-brand-light transition-colors rounded-lg hover:bg-brand/10 cursor-pointer flex items-center gap-1">
                🧕 Hijab Studio
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-colors cursor-pointer"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              )}
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/tryon">
                <Button size="sm">Try It Free</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-lg text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              )}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="p-2 rounded-lg text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute right-0 top-0 h-full w-80 bg-card border-l border-border shadow-2xl"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <Logo size="sm" />
                  <button onClick={() => setIsMobileOpen(false)} className="p-2 cursor-pointer">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex flex-col gap-1 mb-6">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="px-4 py-3 text-base font-medium text-foreground hover:bg-background-secondary rounded-xl transition-colors cursor-pointer"
                    >
                      {link.label}
                    </a>
                  ))}
                  <Link
                    href="/hijab-studio"
                    onClick={() => setIsMobileOpen(false)}
                    className="px-4 py-3 text-base font-medium text-brand hover:bg-brand/10 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
                  >
                    🧕 Hijab Studio
                  </Link>
                </div>

                <div className="flex flex-col gap-3">
                  <Link href="/login" onClick={() => setIsMobileOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">Log In</Button>
                  </Link>
                  <Link href="/tryon" onClick={() => setIsMobileOpen(false)}>
                    <Button className="w-full justify-center">Clothing Try-On</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
