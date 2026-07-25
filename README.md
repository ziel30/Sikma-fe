# SIKMA — Asik Matika

> Cara seru, gratis, dan efektif untuk jago matematika.

**SIKMA** is a gamified math-learning web app: a mobile-first, Duolingo-style experience where students work through learning paths, keep a daily streak alive, and face other players in real-time math duels. This repository holds the **frontend** (Next.js). The API lives in a separate repo — see [Related repositories](#related-repositories).

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Routes](#routes)
- [Architecture notes](#architecture-notes)
- [Related repositories](#related-repositories)

---

## Features

### Learning
- **Learning path** — each *materi* (Postulat, Aritmetika, Aljabar, …) renders as a winding path of lesson nodes, reward chests, and a final trophy, with locked / current / done states.
- **Lesson player** — full-screen multiple-choice quiz with a progress bar, instant answer feedback, and an end-of-lesson summary showing XP earned, time taken, and accuracy.
- **Onboarding & welcome** — first-run flow that greets the user before they reach the dashboard.

### Competitive play
- **Casual match** — quick 1v1. The client waits ~5s in the matchmaking queue and falls back to a local bot opponent if no human is found, so a player is never left waiting.
- **Ranked match** — no client-side bot fallback; the server pairs the player so rank points stay meaningful.
- **Real-time battle** — Socket.IO drives the duel: questions are pushed to both players, answers are scored live (`submit_answer` → `answer_result`), rounds can time out, and `match_end` returns the winner plus rewards. The socket is a singleton so an in-progress match survives page navigation.
- **Leaderboard** — league standings with a top-3 podium and the signed-in user's own rank pinned separately.

### Progression & economy
- **Strike (daily streak)** — current and longest streak, plus a daily-test bonus.
- **XP & levels** — XP, level, and progress toward the next level.
- **Coins & shop** — earn coins from matches and lessons, then buy and equip avatars.
- **Profile & decoration** — editable name, bio, and avatar, with a decoration screen for owned cosmetics.

### Social
- **Follow system** — followers, following, and friends lists with a follow/unfollow button.
- **Notifications** — in-app notification feed.

### Admin panel
A separate desktop-oriented area at `/admin`, gated by role:
- **Dashboard** — totals for users, templates, themes, and matches (ranked vs. all).
- **Users** — paginated user management: edit XP, coins, rank points, role, and ban status.
- **Formula soal** — the question engine. Admins define question *templates* (`{a} + {b} = ?`) with an `answerFormula`, variable `constraints`, and derived values, then preview generated questions before activating them.
- **Tema** — question themes/categories with emoji, color, and sort order.
- **Pengaturan poin** — tunable scoring and reward settings.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, React Server Components) |
| Language | TypeScript 5 |
| UI | React 19, [Tailwind CSS v4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) (new-york), Radix UI, Base UI, Vaul |
| Icons | Phosphor Icons, Lucide |
| Server state | [TanStack Query v5](https://tanstack.com/query) |
| HTTP | Axios (browser + server instances) |
| Validation | [Zod v4](https://zod.dev) — request/response schemas, forms, and env vars |
| Forms | React Hook Form + `@hookform/resolvers` |
| Real-time | Socket.IO client |
| Tooling | ESLint 9 (`eslint-config-next`), SVGR |

---

## Getting started

### Prerequisites

- **Node.js 20+**
- **npm** (a `package-lock.json` is committed; other package managers work but will drift from the lockfile)
- A running **SIKMA backend** — the frontend is API-driven and most screens need it

### Installation

```bash
git clone https://github.com/ziel30/Sikma-fe.git
cd Sikma-fe
npm install
```

### Configure the environment

```bash
cp .env.example .env.local
```

Then edit `.env.local` so `NEXT_PUBLIC_API_URL` points at your backend (see [Environment variables](#environment-variables)).

### Run the dev server

```bash
npm run dev
```

Open <http://localhost:3000>.

> **Port conflict:** the backend also defaults to port `3000`. Start the API on a different port (e.g. `PORT=8080`) and set `NEXT_PUBLIC_API_URL` to match, or run the frontend on another port with `npm run dev -- -p 3001`.

### Production build

```bash
npm run build
npm run start
```

---

## Environment variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:4000/api` | Base URL of the SIKMA backend. Used by both Axios instances **and** as the Socket.IO host (the client connects to the `/match` namespace on it). |

Environment variables are parsed and validated with Zod in [`src/lib/env.ts`](src/lib/env.ts). A missing or malformed value **fails fast at import time** rather than surfacing as a confusing runtime error later.

`.env*` files are gitignored — only `.env.example` is committed. Never commit real credentials.

---

## Available scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run gen:emma` | Regenerate the Emma mascot React components from source SVGs via SVGR — see [`scripts/generate-emma.mjs`](scripts/generate-emma.mjs). Pass a source directory: `npm run gen:emma -- ./path/to/svgs` |

---

## Project structure

The codebase is organised **by feature**, not by file type.

```
src/
├── app/                      # Next.js App Router
│   ├── (app)/                # Authenticated app shell (learn, battle, shop, profile…)
│   ├── (auth)/               # Login & register
│   ├── (player)/             # Full-screen flows (lesson player, onboarding, welcome)
│   ├── admin/                # Admin panel (role-gated, desktop layout)
│   ├── layout.tsx            # Root layout: fonts, QueryProvider, ThemeProvider
│   ├── page.tsx              # Splash + welcome screen
│   └── globals.css           # Tailwind v4 theme tokens (brand colors, radii…)
│
├── features/                 # One folder per domain
│   ├── admin/                #   api.ts     — endpoint calls
│   ├── auth/                 #   schemas.ts — Zod response schemas
│   ├── courses/              #   types.ts   — domain types
│   ├── leaderboard/          #   hooks/     — TanStack Query hooks
│   ├── match/                #   components/— feature-local components
│   ├── notifications/
│   ├── onboarding/
│   ├── profile/
│   ├── shop/
│   └── strike/
│
├── lib/                      # Cross-cutting infrastructure
│   ├── api/                  # Axios clients (browser + server) & error normalisation
│   ├── auth/                 # Session cookie, token, current-user helpers
│   ├── match/                # Socket singleton, question parser, option generator
│   ├── env.ts                # Zod-validated environment
│   └── utils.ts              # `cn()` and friends
│
├── shared/                   # Reusable, domain-agnostic UI
│   ├── components/brand/     # Emma mascot, primary button, speech bubble, icons…
│   ├── components/layout/    # Bottom navigation
│   ├── components/ui/        # shadcn/ui primitives
│   └── providers/            # QueryProvider, ThemeProvider
│
└── proxy.ts                  # Route protection (Next 16's middleware)
```

**Adding a feature?** Follow the `courses` module — it is the reference implementation of the `schemas.ts` + `api.ts` + `hooks/` pattern.

Path alias: `@/*` → `src/*`.

---

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Splash animation → welcome screen |
| `/login`, `/register` | Public | Authentication |
| `/welcome`, `/onboarding` | Auth | First-run flow |
| `/learn` | Auth | Dashboard: profile header, strike card, level carousel |
| `/courses`, `/courses/[slug]` | Auth | Materi list and learning path |
| `/lesson/[lessonId]` | Auth | Full-screen lesson player |
| `/casual` | Auth | Casual matchmaking (bot fallback) |
| `/ranked` | Auth | Ranked matchmaking + league podium |
| `/battle` | Auth | Live 1v1 duel |
| `/leaderboard` | Auth | Global standings |
| `/shop` | Auth | Buy and equip avatars |
| `/notifications` | Auth | Notification feed |
| `/profile` | Auth | Profile overview |
| `/profile/edit`, `/settings`, `/decoration` | Auth | Profile management |
| `/profile/friends`, `/followers`, `/following` | Auth | Social lists |
| `/admin/*` | Admin | Admin panel |

---

## Architecture notes

### Two API clients, one base URL

- [`src/lib/api/client.ts`](src/lib/api/client.ts) — **browser** Axios instance. A request interceptor attaches `Authorization: Bearer <token>` from `localStorage`; a response interceptor normalises every failure through `toApiError`. Helpers `getValidated()` / `postValidated()` parse the response against a Zod schema, so invalid API payloads fail loudly at the boundary instead of leaking into components.
- [`src/lib/api/server-client.ts`](src/lib/api/server-client.ts) — `serverApi()` for Server Components and Route Handlers. It reads the session cookie via `next/headers` so server-side requests are authenticated too.

### Authentication

On login the session is persisted in two places, deliberately:

| Storage | Key | Read by |
| --- | --- | --- |
| Cookie | `sikma_session` | `proxy.ts` (route protection) and the server Axios client |
| localStorage | `sikma:token` | The browser Axios client's request interceptor |
| localStorage | `sikma:role` | UI only — shows/hides admin areas |

[`src/proxy.ts`](src/proxy.ts) runs on every non-static request. Anything outside `/`, `/login`, and `/register` requires a session cookie; otherwise the user is redirected to `/login?from=<path>`. The `(app)` layout re-checks the user server-side as a second gate.

> The stored role is a **UI convenience only** — the backend still enforces authorisation on every admin endpoint.

### Real-time matches

[`src/lib/match/socket.ts`](src/lib/match/socket.ts) exposes a lazily-created **singleton** Socket.IO client on the `/match` namespace, with `autoConnect: false` and a WebSocket-only transport. Because matchmaking starts on `/casual` but the duel renders on `/battle`, a `question` event can arrive mid-navigation — so the module buffers a pending question (`setPendingQuestion` / `takePendingQuestion`) for the battle page to consume once mounted.

### Question generation

[`src/lib/match/generate-options.ts`](src/lib/match/generate-options.ts) parses a question string (`"12 × 4 = ?"`, `"40% dari 60"`, `"√25"`, squares and cubes) into its numeric answer, then builds four multiple-choice options — one correct, three plausible near-misses.

### Styling

Tailwind CSS v4 with CSS-variable theme tokens defined in `src/app/globals.css`, including brand tokens (`--brand`, `--brand-dark`, `--brand-soft`, accent colors) used throughout. shadcn/ui is configured in [`components.json`](components.json) with aliases pointing at `@/shared/components`.

---

## Related repositories

| Repo | Stack | Description |
| --- | --- | --- |
| [Sikma-fe](https://github.com/ziel30/Sikma-fe) | Next.js 16 | This repository — web frontend |
| [Sikma-be](https://github.com/ziel30/Sikma-be) | NestJS 11, Sequelize, PostgreSQL, Socket.IO | REST API, auth, matchmaking gateway, question engine |

---

## License

Private — final-year project (*Tugas Akhir*). Not licensed for redistribution.
