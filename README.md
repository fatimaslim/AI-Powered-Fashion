<div align="center">

# 🧠 StyleMind AI

### AI-Powered Fashion Intelligence Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff69b4?logo=framer)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

**StyleMind AI** is a production-ready AI fashion intelligence platform featuring virtual try-on powered by computer vision, AI styling recommendations, outfit scoring, smart wardrobe management, and an AI fashion assistant — all in one sleek, modern interface.

[🚀 Live Demo](#) · [📖 Documentation](#) · [🐛 Report Bug](https://github.com/issues) · [✨ Request Feature](https://github.com/issues)

</div>

---

## ✨ Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🪞 **Virtual Try-On** | Upload your photo + any garment → photorealistic AI try-on | ✅ Production |
| 🎨 **AI Stylist** | Color analysis, body type recommendations, occasion outfits | ✅ Production |
| 📊 **Outfit Scoring** | 6-dimension outfit analysis (color, fit, style, confidence) | ✅ Production |
| 💬 **Fashion Chat** | AI assistant for fashion advice, trends, and styling tips | ✅ Production |
| 👕 **Smart Wardrobe** | Digital closet management with AI outfit suggestions | ✅ Production |
| 🖼️ **Style Gallery** | Pinterest-style gallery with filters and favorites | ✅ Production |
| 🔐 **Auth System** | Login, register, forgot password with social OAuth UI | ✅ Production |
| 📱 **Dashboard** | Full user dashboard with history, favorites, settings | ✅ Production |
| 🌙 **Dark Mode** | System-aware dark/light theme with smooth transitions | ✅ Production |
| 📱 **Responsive** | Mobile-first design, works on all screen sizes | ✅ Production |

## 🏗️ Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page (assembled sections)
│   ├── layout.tsx                # Root layout (fonts, theme, SEO)
│   ├── tryon/page.tsx            # Virtual try-on page
│   ├── chat/page.tsx             # AI Fashion Chat
│   ├── gallery/page.tsx          # Style Gallery
│   ├── login/page.tsx            # Authentication
│   ├── register/page.tsx         # Registration
│   ├── forgot-password/page.tsx  # Password reset
│   ├── dashboard/                # Protected dashboard
│   │   ├── layout.tsx            # Sidebar layout
│   │   ├── page.tsx              # Dashboard home
│   │   ├── history/              # Generation history
│   │   ├── favorites/            # Saved outfits
│   │   ├── wardrobe/             # Smart wardrobe
│   │   ├── settings/             # App settings
│   │   └── profile/              # User profile
│   └── api/                      # API Routes
│       ├── tryon/route.ts        # FASHN API integration
│       └── ai/
│           ├── stylist/route.ts  # AI Stylist endpoint
│           ├── score/route.ts    # Outfit scoring endpoint
│           └── chat/route.ts     # Fashion chat endpoint
├── components/
│   ├── brand/Logo.tsx            # Animated SVG logo
│   ├── ui/                       # Design system (Button, Card, Badge, Input)
│   ├── landing/                  # Landing page sections
│   ├── tryon/                    # Try-on components
│   └── providers/                # Theme provider
├── store/                        # Zustand state management
│   ├── tryon-store.ts            # Try-on state
│   └── auth-store.ts             # Authentication state
└── lib/                          # Utilities, fonts, helpers
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15.3 (App Router, Turbopack)
- **UI Library:** React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 with custom design tokens
- **Animations:** Framer Motion 12
- **State:** Zustand 5
- **Icons:** Lucide React
- **Components:** Custom component library (CVA + clsx + tailwind-merge)
- **Theming:** next-themes (dark mode)
- **Notifications:** Sonner

### AI/ML Integration
- **Virtual Try-On:** FASHN AI API (diffusion-based garment transfer)
- **Image Processing:** Pica (client-side resize + quality optimization)
- **AI Stylist:** Structured analysis engine (ready for OpenAI/Gemini)
- **Outfit Scoring:** Multi-dimensional analysis pipeline
- **Fashion Chat:** Context-aware fashion AI assistant

### Design
- **Typography:** Inter + Plus Jakarta Sans (Google Fonts)
- **Design System:** Custom CSS variables + Tailwind theme
- **Effects:** Glassmorphism, gradient meshes, animated orbs
- **Animations:** 10+ custom keyframe animations
- **Layout:** CSS Grid, Flexbox, CSS Columns masonry

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- FASHN API key ([get one here](https://app.fashn.ai))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/stylemind-ai.git
cd stylemind-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your FASHN API key to .env.local
# FASHN_API_KEY=your_api_key_here

# Start development server
npm run dev
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FASHN_API_KEY` | Optional | Server-side FASHN API key (users can also enter their own) |
| `FASHN_ENDPOINT_URL` | Optional | Custom FASHN API endpoint (defaults to `https://api.fashn.ai`) |

## 📸 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Premium landing page with 8 sections |
| `/tryon` | Virtual try-on with settings panel |
| `/chat` | AI fashion assistant |
| `/gallery` | Style inspiration gallery |
| `/login` | Sign in page |
| `/register` | Create account page |
| `/forgot-password` | Password reset |
| `/dashboard` | User dashboard home |
| `/dashboard/history` | Generation history |
| `/dashboard/favorites` | Saved outfits & collections |
| `/dashboard/wardrobe` | Virtual wardrobe manager |
| `/dashboard/settings` | App preferences |
| `/dashboard/profile` | User profile |

## 🎨 Design System

### Color Palette
- **Primary:** Indigo-600 (`#4F46E5`) → Violet-600 (`#7C3AED`)
- **Accent:** Rose-500 (`#F43F5E`)
- **Success/Warning/Error:** Semantic color system
- **Dark Mode:** Full dark palette with `slate` tones

### Design Principles
- Glassmorphism with backdrop blur
- Gradient mesh backgrounds
- Micro-animations on every interaction
- Premium card hover effects
- Multi-stage loading experiences
- Responsive from 320px to 4K

## 📜 License & Attribution

This project is licensed under the **MIT License**.

This application is built upon and significantly extends the open-source [FASHN Virtual Try-On](https://github.com/fashn-AI/tryon-nextjs-app) project. The original repository served as the foundation for the FASHN API integration. The application has been extensively redesigned with new architecture, branding, UI/UX, AI features, and product vision.

## 👩‍💻 Author

**Fatima Slim**
- Machine Learning Engineer · Computer Vision Engineer · AI Engineer
- Specializing in computer vision, deep learning, and AI product development

---

<div align="center">

Built with ❤️ by **Fatima Slim** · Powered by **Computer Vision & Deep Learning**

</div>