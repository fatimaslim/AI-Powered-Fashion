import type { Metadata } from "next";
import { inter, plusJakarta } from "@/lib/fonts";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "StyleMind AI — AI-Powered Fashion Intelligence",
    template: "%s | StyleMind AI",
  },
  description:
    "StyleMind AI is an AI-powered fashion intelligence platform featuring virtual try-on, AI styling recommendations, outfit scoring, and an intelligent fashion assistant. Built with computer vision and deep learning.",
  keywords: [
    "AI fashion",
    "virtual try-on",
    "AI stylist",
    "outfit scoring",
    "fashion AI",
    "computer vision",
    "deep learning",
    "StyleMind",
    "fashion intelligence",
    "AI wardrobe",
  ],
  authors: [{ name: "Fatima Slim" }],
  creator: "Fatima Slim",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "StyleMind AI",
    title: "StyleMind AI — AI-Powered Fashion Intelligence",
    description:
      "Experience the future of fashion with AI-powered virtual try-on, intelligent styling, and outfit analysis.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "StyleMind AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "StyleMind AI — AI-Powered Fashion Intelligence",
    description:
      "Experience the future of fashion with AI-powered virtual try-on, intelligent styling, and outfit analysis.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgb(var(--card))",
                color: "rgb(var(--foreground))",
                border: "1px solid rgb(var(--border))",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
