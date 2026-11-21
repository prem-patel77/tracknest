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
Chunks 1-3 done. Currently doing: UI redesign (see below). Chunk 4 items
(loading/error states, validation, README) get done as part of the redesign.

## Redesign rules (current task)
- Use the impeccable skill for design decisions; ui-ux-pro-max only for palette
  and font suggestions; animate for motion. I run /review-animations myself;
  do not try to run it or copy its workflow. Apply its fixes when I paste them.
- Keep the teal palette. Stay in plain CSS (no Tailwind, no UI libraries).
  Put design tokens (colors, spacing, fonts, radii) as CSS variables in
  client/src/index.css.
- Read DESIGN.md before touching any UI. Follow it exactly.
- Redesign one page at a time. Every page needs empty, loading, error states
  and must be responsive down to 375px wide.
- Do not change API routes, database schema or auth logic.
- Keep CSS and animation simple enough to explain in an interview.
- After finishing each page, run /simplify on the changed files.
- Do not commit or push. After each page, stop and tell me how to preview it,
  and I will commit myself.

## Roadmap (build in chunks; I will say which chunk to do)
- Chunk 1 (Phases 10-13): Dashboard layout (sidebar, navbar, summary cards, job table), Add Job form, Edit Job, Delete with confirmation popup.
- Chunk 2 (Phases 14-17): Search by company/position, status filter dropdown (All, Saved, Applied, OA, Interview, Offer, Rejected), sorting, pagination. Do it on the server API (query params) for pagination.
- Chunk 3 (Phases 18, 19, 20): Statistics page (cards, pie chart by status, bar chart per month), responsive design, user profile (edit name, email, password).
- Chunk 4 (Phases 22-24, 26-27): Validation, error handling (404/500/401), loading spinners and disabled buttons, README with screenshots/API docs, testing checklist.
- Deployment (Phase 25) is done together with me: Vercel (client), Render (server), Neon (database). Do not attempt it alone.
- Optional last: dark mode (Phase 21).

## Working rules
- Never run git commit or git push. I make all commits myself.
- During the redesign, stop after each page and tell me how to preview it.
- Never read or commit .env files.