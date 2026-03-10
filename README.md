# ⚡ Reflex Arena

A neon-themed reaction time game built with Next.js, TypeScript, and Tailwind CSS. Test your reflexes by clicking the glowing target as fast as possible!

![Reflex Arena](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer-Motion-ff0055?style=for-the-badge&logo=framer)

---

## Features

- **3 Difficulty Levels** — Easy (5 rounds), Medium (7 rounds with distractors), Hard (10 rounds with more distractors)
- **Distractor Targets** — Fake colored targets in Medium/Hard to trick you
- **Real-time Stats** — Average, best, and worst reaction times per session
- **High Scores** — Persisted in `localStorage`, one record per difficulty tier
- **Performance Ratings** — From *Very Slow* to *Legendary* based on your average
- **Sound Effects** — Synthesized via Web Audio API (no external files needed)
- **Pause / Resume** — Pause during the waiting phase
- **Framer Motion Animations** — Smooth transitions throughout the entire UI
- **Neon Particle Background** — Canvas-based animated particle system
- **Mobile Ready** — Touch controls, responsive layout, no horizontal scroll
- **Keyboard Shortcuts** — Space to pause, Escape to quit

---

## Tech Stack

| Tech | Purpose |
|------|---------|
| [Next.js 15](https://nextjs.org/) | App Router, SSR, file-based routing |
| [TypeScript](https://www.typescriptlang.org/) | Strict mode throughout |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling, no inline styles |
| [Framer Motion](https://www.framer-motion.com/) | All animations and transitions |
| Web Audio API | Synthesized sound effects |
| `localStorage` | High score & settings persistence |
| HTML5 Canvas | Particle background rendering |

---

## Gameplay

1. **Select difficulty** on the main menu
2. A **3-2-1 countdown** starts the game
3. **Wait** — a random delay before the target appears
4. **Click/tap the glowing circle** as fast as possible
5. Clicking before the target appears = **early click penalty**
6. After all rounds, see your **average reaction time** and rating
7. Beat your **personal best** to set a new high score!

### Difficulty Breakdown

| Difficulty | Rounds | Target Size | Delay Range | Distractors |
|-----------|--------|-------------|-------------|-------------|
| Easy | 5 | 120px | 1.5 – 4s | None |
| Medium | 7 | 80px | 1 – 3s | 2 |
| Hard | 10 | 50px | 0.5 – 2.5s | 5 |

### Performance Ratings

| Rating | Average Time |
|--------|-------------|
| ⚡ Legendary | < 150ms |
| 🏆 Excellent | < 200ms |
| 🎯 Great | < 250ms |
| 👍 Good | < 300ms |
| 😐 Average | < 400ms |
| 🐢 Slow | < 500ms |
| 🦥 Very Slow | ≥ 500ms |

---

## Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Click target | Left mouse click | Tap |
| Pause game | `Space` | Pause button in HUD |
| Resume game | `Space` | Resume button |
| Quit to menu | `Escape` (when paused) | Quit button |
| Toggle sound | 🔊 button | 🔊 button |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx         # Root layout & metadata
│   ├── page.tsx           # Main game page (composites everything)
│   └── globals.css        # Global styles, neon effects, glass cards
├── components/
│   ├── ParticleBackground.tsx  # Canvas particle animation
│   ├── MainMenu.tsx            # Difficulty selector, high scores
│   ├── GameArea.tsx            # Target, distractors, phase overlays
│   ├── HUD.tsx                 # Round counter, avg time, pause/sound
│   ├── Countdown.tsx           # 3-2-1 overlay
│   ├── PauseScreen.tsx         # Pause menu
│   └── GameOver.tsx            # Results, rating, round breakdown
├── hooks/
│   ├── useGameState.ts    # Core game state machine
│   ├── useSound.ts        # Web Audio API synthesized sounds
│   └── useHighScores.ts   # localStorage high score management
├── types/
│   └── game.ts            # All TypeScript interfaces & types
└── constants/
    └── game.ts            # Difficulty configs, rating thresholds
```

---

## Run Locally

```bash
# Clone the repository
git clone https://github.com/Ismat-Samadov/reaction_time.git
cd reaction_time

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## Deploy to Vercel

The project is deploy-ready with zero configuration.

**Option 1 — Vercel Dashboard:**
1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository and click **Deploy**

**Option 2 — Vercel CLI:**
```bash
npm i -g vercel
vercel
```

---

## License

MIT
