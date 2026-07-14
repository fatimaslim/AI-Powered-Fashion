"use client";

import { Heart, Github, Twitter, Linkedin, Mail } from "lucide-react";
import Logo from "@/components/brand/Logo";

const footerLinks = {
  Product: [
    { label: "Virtual Try-On", href: "/tryon" },
    { label: "AI Stylist", href: "/tryon" },
    { label: "Fashion Chat", href: "/chat" },
    { label: "Gallery", href: "/gallery" },
    { label: "Pricing", href: "#pricing" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Partners", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socialLinks = [
  { icon: <Github className="h-5 w-5" />, href: "https://github.com", label: "GitHub" },
  { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
  { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
  { icon: <Mail className="h-5 w-5" />, href: "#", label: "Email" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 lg:py-16 grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Logo size="md" />
            <p className="mt-4 text-sm text-foreground-muted leading-relaxed max-w-xs">
              AI-powered fashion intelligence platform. Virtual try-on, styling analysis,
              and smart wardrobe management.
            </p>
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-foreground-muted text-center sm:text-left">
            <p className="flex items-center gap-1 justify-center sm:justify-start flex-wrap">
              Designed & Developed with <Heart className="h-3.5 w-3.5 text-accent inline" /> by{" "}
              <span className="font-semibold text-foreground">Fatima Slim</span>
            </p>
            <p className="text-xs mt-1">
              Machine Learning Engineer · Computer Vision Engineer · AI Engineer
            </p>
          </div>
          <div className="text-xs text-foreground-muted text-center sm:text-right">
            <p>© {currentYear} StyleMind AI. All rights reserved.</p>
            <p className="mt-1 opacity-75">
              Version 1.0 · Last Updated: July 2026
            </p>
          </div>
        </div>

        {/* Acknowledgment */}
        <div className="border-t border-border py-4">
          <p className="text-[11px] text-foreground-muted/60 text-center leading-relaxed">
            This project is built upon and significantly extends the open-source{" "}
            <a
              href="https://github.com/fashn-AI/tryon-nextjs-app"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground-muted transition-colors"
            >
              FASHN Virtual Try-On
            </a>{" "}
            project (MIT License). The application has been extensively redesigned with new architecture,
            branding, UI/UX, AI features, and product vision.
          </p>
        </div>
      </div>
    </footer>
  );
}
