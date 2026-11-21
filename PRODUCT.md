# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: students and new grads in an active internship or entry-level recruiting season, juggling roughly 20-60 applications at once. They add and update jobs on a laptop, and check deadlines on a phone between classes. The job: never miss a deadline or an online assessment (OA), and always know where every application stands.

Secondary (confirmed): recruiters and interviewers who open the live demo link from the README or a resume. They skim for about a minute, so the first screens must look credible and finished. This audience shapes polish and demo data, not the product's purpose.

## Product Purpose

TrackNest is a full-stack job application tracker. A student saves jobs, moves each one through the hiring pipeline, and sees how the search is going. Success: the student opens it and knows within seconds what needs attention today. It is also a portfolio project built to land internships, so it must be explainable end to end in an interview.

## Positioning

Two things a generic spreadsheet or Notion board does not do by default:

- **Student-shaped pipeline.** Statuses are Saved, Applied, OA, Interview, Offer, Rejected. OA is a first-class stage because online assessments are a standard internship step.
- **Deadline awareness.** Each job row states urgency in words ("In 3 days", "2 days overdue"), so the student sees what is pressing without opening anything.

## Operating Context

- Used in short, frequent sessions during recruiting season: add a job, change a status, check what is due.
- Laptop for data entry, phone for quick checks (responsive down to 375px wide is required).
- Ships a light and a dark theme, following the viewer's system setting by default.
- Demo account is shared and read-only for name, email and password; jobs can still be added, edited and deleted. `/demo` logs in with one click.
- The API runs on Render's free tier, so the first request after inactivity can take up to a minute. Loading states must carry that wait gracefully.

## Capabilities and Constraints

- Pages: Login, Register, Demo login, Dashboard (summary cards, search, status filter, sort, paginated job table), Add Job, Edit Job, Delete with confirmation popup, Statistics (summary cards, pie chart by status, bar chart per month), Profile, 404.
- Search, filter, sort and pagination run on the server through query params.
- Dark mode is included (confirmed, replacing the earlier "no dark mode for now"). The theme defaults to the system setting, a toggle in the app switches it, and the choice is remembered in the browser (`localStorage`). It is a front-end feature only: no API, database or auth change.
- Stack is fixed: React (Vite), React Router, Axios, Recharts, plain CSS, with Node/Express and PostgreSQL on Neon. No Tailwind, no UI libraries.
- Do not change API routes, the database schema or auth logic.
- Hosting: Vercel (client), Render (server), Neon (database).
- Code must stay simple and commented so a beginner can explain it in an interview.

## Brand Commitments

- Name: TrackNest.
- Teal palette is binding (see `design/colors.md`): main #0d9488, lighter #14b8a6, light background #f0fdfa, dark text #0f172a, card background #ffffff.
- Plain CSS only, with design tokens as CSS variables in `client/src/index.css`.

## Evidence on Hand

- Live demo: https://tracknest-flax.vercel.app/demo
- Existing screenshots in `docs/screenshots/` (dashboard, statistics, add job, login, mobile dashboard).
- Seeded demo account (`demo@tracknest.dev`). No real user testimonials or usage numbers exist; none should be invented.

## Product Principles

1. **What needs me today?** The deadline and status are the first things read on any job row.
2. **Fast to update.** Adding a job or changing a status takes a few seconds; nothing blocks the common path.
3. **Honest states.** Every page has designed empty, loading and error states, including the slow first load on the free server tier.
4. **Credible in a minute.** A recruiter skimming the demo should see consistent, finished work with real-feeling data, in whichever theme their system uses.
5. **Explainable.** Every visual decision is simple enough for the author to defend line by line in an interview.

## Accessibility & Inclusion

- Responsive and usable down to 375px wide.
- Keyboard users must get a clear focus indicator on everything interactive.
- Respect `prefers-reduced-motion`.
- WCAG AA contrast in both the light and the dark theme: 4.5:1 for text, 3:1 for status stripes, chart marks and input outlines.
- The theme toggle is keyboard reachable and has an accessible name; the theme follows `prefers-color-scheme` until the user chooses.
- Status must never depend on colour alone (every status carries a text label).
