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
Phases 1-8 done (setup, schema, Express API, auth, job CRUD, React setup with routing).
Next: Phase 9 login/register UI, then Phase 10 dashboard (sidebar, navbar, summary cards, job table).
Plan: deploy early (Vercel + Render + Neon), then search/filter/sort/pagination, charts, polish.