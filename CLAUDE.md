# TrackNest
Full-stack job application tracker (portfolio project for internship applications).

## Stack
- client/: React (Vite), React Router, Axios, plain CSS (colors in client/src/index.css)
- server/: Node + Express, PostgreSQL on Neon, JWT auth (bcryptjs)

## Rules
- Windows + PowerShell. Run client commands in client/, server commands in server/.
- Never commit .env files.
- Keep code simple and commented so a beginner can explain it in interviews.
- After each step, briefly explain what you changed and why.

## Progress
Phases 1-13 done and deployed (Vercel + Render + Neon). Pushing to main auto-redeploys both. Phases 14-17 (Chunk 2) done locally, not pushed yet. Next: Chunk 3.

## Roadmap (build in chunks; I will say which chunk to do)
- Chunk 1 (Phases 10-13): Dashboard layout (sidebar, navbar, summary cards, job table), Add Job form, Edit Job, Delete with confirmation popup.
- Chunk 2 (Phases 14-17): Search by company/position, status filter dropdown (All, Saved, Applied, OA, Interview, Offer, Rejected), sorting, pagination. Do it on the server API (query params) for pagination.
- Chunk 3 (Phases 18, 19, 20): Statistics page (cards, pie chart by status, bar chart per month), responsive design, user profile (edit name, email, password).
- Chunk 4 (Phases 22-24, 26-27): Validation, error handling (404/500/401), loading spinners and disabled buttons, README with screenshots/API docs, testing checklist.
- Deployment (Phase 25) is done together with me: Vercel (client), Render (server), Neon (database). Do not attempt it alone.
- Optional last: dark mode (Phase 21).

## Working rules
- After each phase, make a local git commit (never push). Stop at the end of a chunk and tell me how to test.
- Never read or commit .env files.