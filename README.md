# Personal Transformation OS

> Turn your goals into actions, your actions into evidence, and your evidence into lasting progress.

A production-quality personal operating system that bridges the gap between intention and execution:
**Information → Decision → Action → Evidence → Reflection → Learning → Adaptation → Better Action.**

---

## Live Deployment

- **Live Web App**: [https://ptos-exec-89214.web.app](https://ptos-exec-89214.web.app)
- **Command Center Dashboard**: [https://ptos-exec-89214.web.app/dashboard](https://ptos-exec-89214.web.app/dashboard)
- **Onboarding Wizard**: [https://ptos-exec-89214.web.app/onboarding](https://ptos-exec-89214.web.app/onboarding)
- **Firebase Project ID**: `ptos-exec-89214`

---

## Core Pillars & Architecture

1. **Next Action Engine**: Answers *"What is the most useful thing I should do right now?"* by evaluating active goals, project momentum, task priority, circadian energy windows, and available time.
2. **Focus Studio**: Built-in 25/45/50/60/90-minute blocks, procedural Web Audio Brown Noise, fullscreen minimal mode, and completion reflection.
3. **I'm Stuck Reset**: Diagnostic intervention shrinking roadblocks into an immediate 2-minute starter action with countdown.
4. **Bad Day Mode**: Compresses the day down to 5 essential anchors to protect momentum without shame.
5. **Body & Mind Baseline**: Sleep consistency, workout logger (sets, reps, weight), mood/energy tracking, and Frustration Journal.
6. **7-Pillar Transformation Score**: Transparent scoring across Execution, Focus, Body, Mind, Digital, Consistency, and Reflection.
7. **Personal Operating Manual**: Dynamic document synthesizing peak focus times, work windows, triggers, and recovery protocols.

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Persistence**: Dual-Mode (Reactive LocalStorage + Firebase Auth & Firestore)
- **Audio Engine**: Web Audio API Procedural Brown Noise generator
- **Hosting**: Firebase Hosting CDN (`ptos-exec-89214.web.app`)

---

## Local Development

```bash
# Clone the repository
git clone <repo-url>
cd habit-tracker

# Install dependencies
npm install

# Start local dev server
npm run dev

# Run engine validation tests
npx tsx scratch/run_engine_tests.ts
```
