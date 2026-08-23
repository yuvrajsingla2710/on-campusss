<p align="center">
  <img src="https://img.shields.io/badge/ON-CAMPUS-blueviolet?style=for-the-badge&logoColor=white" alt="On Campus" />
</p>

<h1 align="center">🎓 ON CAMPUS</h1>

<p align="center">
  <strong>Everything your campus has. Connected.</strong>
</p>

<p align="center">
  A futuristic digital ecosystem for university students — connecting people, knowledge, skills, resources, projects, and opportunities within a single platform.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Three.js-0.185-000000?style=flat-square&logo=three.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_AI-Powered-4285F4?style=flat-square&logo=google&logoColor=white" />
</p>

---

## 📖 About

**On Campus** is a comprehensive digital ecosystem designed for university students. It bridges the gap between scattered campus resources by providing a unified, interactive platform where students can discover, share, learn, collaborate, and contribute — all within their university.

> Think of it as the **super-app for campus life** — part marketplace, part mentorship network, part project hub, part AI assistant.

---

## ✨ Core Services

| Service | Description |
|---------|-------------|
| 🛠️ **Borrow** | Borrow useful items (lab gear, electronics, tools, calculators) from verified students with deposit tracking and return deadlines. |
| 🧭 **Guidance** | Learn from students who've navigated courses, professors, and campus processes. Get peer mentorship and insider tips. |
| 🤝 **Skill Exchange** | AI-powered skill matching to connect students who can teach what others want to learn — and vice versa. |
| 🛒 **Marketplace** | Buy and sell books, notes, furniture, electronics, and other student essentials with verified seller profiles. |
| 🌟 **Impact** | Create and join projects, communities, events, and shared initiatives that benefit the entire campus. |
| 🧭 **~COMPASS~** | An intelligent AI assistant (powered by Gemini) that helps students navigate the entire On Campus ecosystem. |

---

## 🚀 Key Features

- **🏆 Campus Impact Scoring & Karma Engine** — A reputation system that rewards contributions with a transparent impact score.
- **📊 Competitive Leaderboard** — Full leaderboard with Top-3 rank nametags, category breakdowns, and monthly growth tracking.
- **🛡️ Student Passport** — Cryptographic student credentials with verified badges and profile verification.
- **🌐 Interactive 3D Campus Digital Twin** — Explore a Three.js-powered 3D visualization of the campus environment.
- **📡 Real-Time Campus Pulse** — A live feed of campus activity across sports, academics, projects, events, and discussions.
- **🔬 Projects & Research Collaboration** — Create projects, recruit talent, track progress, and collaborate with peers.
- **📦 Peer-to-Peer Equipment Borrowing** — Verified borrowing system with location, availability, and deposit tracking.
- **🧠 Skill Matching & Peer Mentorship Squads** — Smart skill-swap matching with compatibility scores.
- **🤖 COMPASS AI Assistant** — Gemini-powered contextual assistant with suggested cards and follow-up queries.
- **💬 Direct Messaging & Friend System** — Private messaging, friend requests, and privacy controls.
- **🔔 Smart Notifications** — Contextual notifications for borrow requests, project invites, skill swaps, kudos, and more.
- **🎨 Command Palette** — Quick-access command palette (Cmd+K) for fast ecosystem navigation.
- **📱 Mobile-First Design** — Fully responsive with a dedicated mobile section navigator.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework with latest concurrent features |
| **TypeScript 5.8** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **Three.js** | 3D Campus Digital Twin visualization |
| **Framer Motion** | Smooth animations and micro-interactions |
| **Radix UI** | Accessible, unstyled component primitives |
| **Recharts** | Data visualization for analytics and leaderboards |
| **Lucide React** | Icon system |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Express 4** | REST API server |
| **Google Gemini AI** | COMPASS AI assistant intelligence |
| **Vite 6** | Dev server with HMR + production bundler |
| **TSX** | TypeScript execution for the server |
| **esbuild** | Production server bundling |

---

## 📁 Project Structure

```
on-campusss/
├── index.html                  # Entry HTML with SEO meta tags
├── server.ts                   # Express backend + Gemini AI integration
├── vite.config.ts              # Vite configuration
├── package.json                # Dependencies and scripts
├── components.json             # shadcn/ui component config
├── .env.example                # Environment variable template
│
├── src/
│   ├── main.tsx                # React app entry point
│   ├── App.tsx                 # Root application component
│   ├── index.css               # Global styles and design tokens
│   ├── types.ts                # TypeScript type definitions
│   │
│   ├── components/
│   │   ├── Navbar.tsx              # Main navigation bar
│   │   ├── Hero.tsx                # Landing hero section
│   │   ├── ServicesSection.tsx     # Core services showcase
│   │   ├── MarketplaceSection.tsx  # Student marketplace
│   │   ├── ProjectsSection.tsx     # Projects & collaboration hub
│   │   ├── CampusPulseSection.tsx  # Live campus activity feed
│   │   ├── CompassSection.tsx      # COMPASS AI section
│   │   ├── ImpactLeaderboard.tsx   # Rankings & impact scores
│   │   ├── Campus3DVisualizer.tsx  # Three.js 3D campus model
│   │   ├── CampusChatSection.tsx   # Campus-wide chat
│   │   ├── AuthModal.tsx           # Authentication flows
│   │   ├── StudentPassportModal.tsx # Student credential passport
│   │   ├── FloatingCompassWidget.tsx # Floating AI assistant
│   │   ├── Footer.tsx              # Site footer
│   │   ├── ui/                     # Reusable UI primitives (shadcn)
│   │   └── views/                  # Page-level view components
│   │
│   ├── data/
│   │   └── mockData.ts         # Mock data for development
│   │
│   ├── hooks/                  # Custom React hooks
│   └── lib/                    # Utility functions
│
└── public/                     # Static assets
```

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** or **bun** (lock file included for bun)
- **Gemini API Key** (optional — for COMPASS AI features)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yuvrajsingla2710/on-campusss.git
cd on-campusss

# 2. Install dependencies
npm install
# or
bun install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### Development

```bash
# Start the dev server (frontend + backend)
npm run dev
```

The app will be available at **http://localhost:3000**

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Optional | Google Gemini API key for COMPASS AI assistant |
| `APP_URL` | Optional | The URL where the app is hosted (for self-referential links) |

---

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Dev** | `npm run dev` | Start development server with HMR |
| **Build** | `npm run build` | Build frontend (Vite) + backend (esbuild) |
| **Start** | `npm start` | Run the production server |
| **Preview** | `npm run preview` | Preview production build locally |
| **Lint** | `npm run lint` | Type-check with TypeScript |
| **Clean** | `npm run clean` | Remove build artifacts |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <strong>Built with ❤️ for students, by students.</strong>
</p>

<p align="center">
  <em>Everything your campus has. Connected.</em>
</p>