# 🟢 Sentinel — Distributed Uptime Monitor

A full-stack uptime monitoring app (think UptimeRobot / Pingdom) that checks your websites on a schedule, tracks response times, detects downtime without false alarms, and shows everything on a live dashboard.

Built as a learning / portfolio project — but the architecture is the real thing: a distributed check pipeline with a job queue, multiple workers, and Redis locks.

## Features

- **Per-user monitors** — JWT auth (signup/login), every user sees only their own monitors
- **Distributed checking** — a scheduler enqueues jobs into Redis (BullMQ); independent workers pick them up, so you can run as many workers as you want
- **No duplicate checks** — Redis locks (`SET NX PX`) guarantee only one worker checks a monitor at a time
- **No false alarms (flapping detection)** — a monitor is only marked DOWN after N consecutive failures (`failureThreshold`), not on a single blip
- **Per-monitor intervals** — each monitor is checked on its own schedule (30s, 60s, 5min...), tracked in the DB so scheduler restarts don't reset timing
- **Incidents** — every downtime period is recorded with start time, duration, and cause
- **Real uptime numbers** — 24h / 7d / 30d uptime computed from raw check history
- **Live dashboard** — React frontend with response-time charts (Recharts), incident timeline, and 30s auto-refresh — no manual reloading

## Architecture

```
                ┌────────────┐      every 10s: "who is due?"
                │ Scheduler  │──────────────┐
                └────────────┘              ▼
                                   ┌─────────────────┐
                                   │  Redis (BullMQ)  │   job queue
                                   └─────────────────┘
                                      ▲           │
              lock per monitor        │           ▼
                ┌────────────┐   ┌────────────┐ ┌────────────┐
                │  Worker N  │...│  Worker 2  │ │  Worker 1  │   HTTP checks
                └────────────┘   └────────────┘ └────────────┘
                                        │
                                        ▼
                                 ┌────────────┐
                                 │  MongoDB   │  monitors / checks / incidents / users
                                 └────────────┘
                                        ▲
                                        │ REST API (Express + JWT)
                                 ┌────────────┐
                                 │  Frontend  │  React + Vite + Tailwind
                                 └────────────┘
```

**Why a queue instead of a simple loop?** Because it decouples *deciding* what to check from *doing* the check. The scheduler stays tiny, and check capacity scales horizontally — just start more workers. Redis locks make extra workers safe (two workers grabbing the same job results in exactly one check).

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router, Recharts |
| API | Node.js, Express 5, JWT (jsonwebtoken), bcryptjs |
| Jobs | BullMQ + Redis (ioredis) |
| Database | MongoDB (Mongoose) |

## Getting started

**Prerequisites:** Node 20+, a MongoDB database, a Redis instance (e.g. Redis Cloud free tier — set eviction policy to `noeviction` for BullMQ).

```bash
# 1. clone & install
git clone <repo-url>
cd uptime-monitor
npm install
cd dashboard && npm install && cd ..

# 2. configure — create .env in the repo root:
#    MONGO_URI=mongodb+srv://...
#    REDIS_URL=redis://...
#    JWT_SECRET=any-long-random-string
#    PORT=4000

# 3. run everything (API + worker + scheduler + frontend) in one command
npm run dev
```

Open http://localhost:5173, create an account, and add your first monitor.

Individual processes, if you want them in separate terminals:

```bash
npm run api        # Express API on :4000
npm run worker     # check worker (run multiple for distributed checking!)
npm run scheduler  # enqueues due checks every 10s
npm run web        # Vite dev server on :5173
```

## API overview

All `/monitors` routes require `Authorization: Bearer <token>`.

| Method | Route | What it does |
|---|---|---|
| POST | `/auth/signup` | create account → returns JWT |
| POST | `/auth/login` | login → returns JWT |
| GET | `/monitors` | your monitors |
| POST | `/monitors` | add monitor `{ name, url, intervalSeconds, alertEmail }` |
| DELETE | `/monitors/:id` | delete monitor + its checks & incidents |
| GET | `/monitors/:id/uptime` | `{ uptime24h, uptime7d, uptime30d }` |
| GET | `/monitors/:id/checks` | last 50 checks (response times) |
| GET | `/monitors/:id/incidents` | downtime history |

## Project structure

```
├── server.js            # Express API entry
├── scheduler-queue.js   # enqueues due checks (per-monitor intervals)
├── worker.js            # picks up jobs, runs HTTP checks, Redis locks
├── models/              # Mongoose schemas: User, Monitor, Check, Incident
├── routes/              # auth.js, monitors.js (JWT-protected, per-user scoped)
├── middleware/          # JWT auth guard
├── services/            # checker, uptime calculation, alerting
├── queue/               # BullMQ queue + Redis connection
└── dashboard/           # React frontend
    └── src/
        ├── pages/       # Landing, Login, Signup, Dashboard, MonitorDetail
        ├── components/  # Navbar, MonitorCard, ResponseChart, ...
        └── services/    # api.js — all backend calls in one place
```

## Things I'd add next

- Email alerts on downtime (alert email is already collected per monitor)
- Pause/resume and edit monitors from the UI (`isPaused` already exists in the model)
- Public status pages per user
- httpOnly-cookie sessions instead of localStorage tokens
- Deploy: API + workers on a VPS/Render, frontend on Vercel

---

Built by **Harsh Singh** while learning full-stack development — the comments in the code are intentionally beginner-friendly.
