---
name: TrackNest
description: A student job tracker designed like a league table - ranked rows, zone stripes, progress pips and worded deadlines on a deep-teal rail.
colors:
  teal-main: "#0d9488"
  teal-light: "#14b8a6"
  teal-action: "#0f766e"
  teal-action-hover: "#115e59"
  rail-teal: "#0f3f3b"
  rail-text: "#b7e4de"
  rail-active-text: "#04201e"
  mint-wash: "#f0fdfa"
  tab-tint: "#e6f4f2"
  tab-text: "#0f5a54"
  page: "#f3f7f7"
  card: "#ffffff"
  ink: "#0f172a"
  ink-muted: "#475569"
  hairline: "#d5e3e2"
  hairline-soft: "#e5eeed"
  field-border: "#6b8f8c"
  soon-amber: "#b45309"
  overdue-red: "#b91c1c"
  error-bg: "#fef2f2"
  error-border: "#fecaca"
  success-green: "#166534"
  success-bg: "#dcfce7"
  status-saved: "#78879b"
  status-applied: "#3b82f6"
  status-oa: "#d97706"
  status-interview: "#8b5cf6"
  status-offer: "#16a34a"
  status-rejected: "#ef4444"
typography:
  display:
    fontFamily: "'Barlow Semi Condensed', system-ui, sans-serif"
    fontSize: "2.375rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
    fontFeature: "'tnum'"
  headline:
    fontFamily: "'Barlow Semi Condensed', system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.1
  title:
    fontFamily: "'Barlow Semi Condensed', system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  table:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.4
    fontFeature: "'tnum'"
  label:
    fontFamily: "'Barlow Semi Condensed', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "10px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
  page: "36px"
components:
  button-primary:
    backgroundColor: "{colors.teal-action}"
    textColor: "{colors.card}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.teal-action-hover}"
  button-outline:
    backgroundColor: "{colors.card}"
    textColor: "{colors.teal-action}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
    height: "42px"
  stat-tab:
    backgroundColor: "{colors.tab-tint}"
    textColor: "{colors.tab-text}"
    typography: "{typography.label}"
    padding: "5px 12px"
  status-tag:
    rounded: "{rounded.sm}"
    padding: "2px 9px"
    typography: "{typography.label}"
  rail:
    backgroundColor: "{colors.rail-teal}"
    textColor: "{colors.rail-text}"
    width: "232px"
  rail-link-active:
    backgroundColor: "{colors.teal-light}"
    textColor: "{colors.rail-active-text}"
    rounded: "{rounded.md}"
  table-row:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.table}"
    height: "48px"
---

<!-- PLAN: this system was chosen with the user before any code was built (decision round, "League Table"). Re-run /impeccable document after the first page ships to capture real tokens and generate .impeccable/design.json. The frontmatter above holds the LIGHT theme. The DARK theme is in "Colors > Themes". Dark mode is included in the product. -->

# Design System: TrackNest

## Overview

**Creative North Star: "The League Table"**

TrackNest reads like the standings page of a sports league, built for the one season a student cares about. Every application has a rank, a coloured zone stripe, a short tag for its stage, a five-pip form guide and a deadline written in words. The student scans down one column and knows what is pressing, the way a fan scans for who is at risk. The world lends four things only: condensed tabular numerals, hairline-ruled modules with small header tabs, one deep-teal shell, and the pip guide. Navigation and controls stay standard web components (a sidebar, a real `<table>`, native inputs and selects).

The mood is calm, exact and finished. It is dense enough to show a 40-row season without feeling like a spreadsheet, and flat enough to explain line by line in an interview. Teal does real jobs (the shell, selection, action, focus) and is never sprinkled. Status colours are the only other hues and always travel with a text label.

**Key Characteristics:**
- Deep-teal rail, light cool-grey page, white hairline-ruled modules.
- Condensed numerals in tabular figures; body in a friendly humanist sans.
- Flat: borders instead of shadows. Small, crisp radii (4/6/10px).
- Stage is shown three ways at once: zone stripe, text tag, pips. Never colour alone.
- Deadlines are written ("In 3 days", "2 days overdue") with an icon, never just coloured.
- Two themes, light and dark, share one structure and one set of semantic colour variables. The first visit follows the system setting; the toggle's choice is remembered.

## Colors

One teal family carries the brand and the shell; six status hues carry meaning; everything else is cool grey.

### Primary
- **Brand Teal** (`#0d9488`, `teal-main`): the binding brand colour. Used for pips, the focus ring, the zone of selection, chart bars, links on hover and large numerals. Not used as a fill behind small white text.
- **Action Teal** (`#0f766e`, `teal-action`; hover `#115e59`): the fill for solid buttons, because white on `#0d9488` is only 3.7:1 and fails AA for body-size text. Same hue, one step deeper.
- **Light Teal** (`#14b8a6`, `teal-light`): the active rail link and the focus border.

### Neutral
- **Deep Rail Teal** (`#0f3f3b`, `rail-teal`): the sidebar and the auth panel. Text on it is `#b7e4de` (active link text `#04201e` on Light Teal).
- **Mint Wash** (`#f0fdfa`, `mint-wash`): row hover, selected states, empty-state tile.
- **Tab Tint** (`#e6f4f2`) with **Tab Text** (`#0f5a54`): module header tabs and table header row.
- **Page** (`#f3f7f7`) behind white **Card** (`#ffffff`) modules.
- **Ink** (`#0f172a`) for text, **Ink Muted** (`#475569`) for secondary text (7:1 on white; never use lighter greys for text).
- **Hairline** (`#d5e3e2`) module and table borders, **Hairline Soft** (`#e5eeed`) row dividers, **Field Border** (`#6b8f8c`, 3.5:1 on white, the minimum for an input outline) inputs.

### Status (zone stripe, pips and chart share these)
| Status | Stripe / chart | Tag background | Tag text |
| --- | --- | --- | --- |
| Saved | `#78879b` | `#e2e8f0` | `#334155` |
| Applied | `#3b82f6` | `#dbeafe` | `#1d4ed8` |
| OA | `#d97706` | `#fef3c7` | `#92400e` |
| Interview | `#8b5cf6` | `#ede9fe` | `#5b21b6` |
| Offer | `#16a34a` | `#dcfce7` | `#166534` |
| Rejected | `#ef4444` | `#fee2e2` | `#991b1b` |

Stripe and chart colours are all at least 3:1 on a white module; tag text is at least 5:1 on its tint.

Urgency: **Soon Amber** `#b45309` and **Overdue Red** `#b91c1c` (both pass AA on white). Error uses `#b91c1c` text on `#fef2f2` with a `#fecaca` border.

### Themes: light and dark

Dark mode is part of the product. Every colour is a **semantic CSS variable** (surface, text, border, brand, status, message) defined twice in `client/src/index.css`: once in `:root` (light) and once in `:root[data-theme="dark"]`. Components only ever use `var(--name)`; a raw hex or `rgba()` is allowed only inside those two token blocks.

**How the theme is chosen:** a tiny script in `client/index.html` sets `data-theme` on `<html>` before the page draws, so there is no flash. It uses the choice saved in `localStorage` (key `theme`), and if there is none, the system `prefers-color-scheme`. The dark block also sets `color-scheme: dark` so scrollbars and native controls match. The theme change itself is instant, with no cross-fade.

The frontmatter and the tables above are the light theme. The dark set is below. All body text is at least 4.5:1, and stripes, pips, chart marks and input outlines are at least 3:1 against their surface in **both** themes (checked).

#### Dark palette

| Role | Light | Dark |
| --- | --- | --- |
| Page | `#f3f7f7` | `#0b1514` |
| Surface (modules, table, inputs) | `#ffffff` | `#111f1e` |
| Row hover, selected (wash) | `#f0fdfa` | `#162b29` |
| Header tab, table header | `#e6f4f2` | `#172a28` |
| Header tab text | `#0f5a54` | `#7fd8cf` |
| Text | `#0f172a` | `#e6f2f1` |
| Muted text | `#475569` | `#9db8b5` |
| Line | `#d5e3e2` | `#27403e` |
| Line soft | `#e5eeed` | `#1d3331` |
| Field border | `#6b8f8c` | `#5f8582` |
| Brand accent (pips, bars, focus accents) | `#0d9488` | `#2dd4bf` |
| Light teal (active link, focus border) | `#14b8a6` | `#14b8a6` |
| Solid button fill / its text | `#0f766e` / `#ffffff` | `#14b8a6` / `#04201e` |
| Solid button hover | `#115e59` | `#2dd4bf` |
| Sidebar | `#0f3f3b` | `#071a18` |
| Sidebar text / active text | `#b7e4de` / `#04201e` | `#b7e4de` / `#04201e` |
| Due soon | `#b45309` | `#fbbf24` |
| Overdue, error text | `#b91c1c` | `#f87171` (overdue), `#fca5a5` (error text) |
| Error background / border | `#fef2f2` / `#fecaca` | `#3a1517` / `#7f1d1d` |
| Delete button fill | `#b91c1c` | `#dc2626` (white text, 4.8:1) |
| Success text / background | `#166534` / `#f0fdf4` | `#86efac` / `#14321f` |
| Info text / background | `#1d4ed8` / `#eff6ff` | `#93c5fd` / `#14283f` |
| Skeleton | `#e2ecec` to `#f1f6f6` | `#1b302e` to `#243d3a` |
| Modal overlay | `rgba(15,23,42,0.5)` | `rgba(0,0,0,0.65)` |
| Focus ring | `rgba(13,148,136,0.3)` | `rgba(45,212,191,0.4)` |

#### Dark status and chart colours

| Status | Stripe, pips and chart | Tag background | Tag text |
| --- | --- | --- | --- |
| Saved | `#94a3b8` | `#243342` | `#cbd5e1` |
| Applied | `#60a5fa` | `#1e3a5f` | `#bfdbfe` |
| OA | `#fbbf24` | `#4a3410` | `#fde68a` |
| Interview | `#a78bfa` | `#34265e` | `#ddd6fe` |
| Offer | `#4ade80` | `#14401f` | `#bbf7d0` |
| Rejected | `#f87171` | `#4a1d1d` | `#fecaca` |

Charts read the same `--status-*` variables, so the pie recolours with the theme. Bar chart bars use the brand accent (`#2dd4bf` in dark), gridlines use Line soft, axis and legend text use Muted text, and the tooltip uses Surface with a Line border and Text. No chart colour is hard-coded.

In dark mode the sidebar is darker than the page (`#071a18` against `#0b1514`), so it still reads as the frame. Depth stays hairline-based: a module is a Surface step lighter than the Page with a Line border. The modal is the only shadow (`0 16px 40px rgba(0,0,0,0.6)`).

### Named Rules
**The Semantic Variable Rule.** Components use role names (`--surface`, `--ink`, `--line`, `--status-oa`), never colour names, and never a raw colour. A new colour is added to both theme blocks in the same edit.
**The Zone Stripe Rule.** The 4px stripe at the left of a row always shows the status colour, never urgency. Urgency lives only in the deadline text and its icon, so the two signals never contradict.
**The Words-Not-Colour Rule.** Every status and every deadline state carries a text label. Colour reinforces, it never carries alone.
**The Teal Job Rule.** Teal appears as shell, selection, action, focus or data. If a teal element does none of those, remove it.

## Typography

**Display / Headline / Numerals:** Barlow Semi Condensed (700 and 600), fallback system-ui.
**Body / UI / Table:** Barlow (400, 500, 600), fallback system-ui.
Both load from Google Fonts with `display=swap` (add the link to `client/index.html` during the build; only these five weights).

**Character:** the condensed face gives numbers and headers the compact, scoreboard authority of a standings table; Barlow keeps reading text friendly and open. Tabular figures (`font-variant-numeric: tabular-nums`) are on for every number so columns align.

### Hierarchy
- **Display** (700, 2.375rem, 1.1): the number inside a stat module.
- **Headline** (700, 1.875rem, 1.1; 1.5rem at 640px and below): the page title, one per page.
- **Title** (600, 1.125rem, 1.25): module and chart titles, modal titles.
- **Body** (400, 1rem, 1.5): forms, descriptions, helper text; lines up to 70ch. Inputs are always 16px so phones never zoom.
- **Table** (400, 0.9375rem, 1.4): cells. Company name is 600.
- **Label** (600, 0.75rem, 0.08em tracking, uppercase, Barlow Semi Condensed): stat tabs, table headers, status tags (tags are not uppercase).

### Named Rules
**The No-Small-Text Rule.** Nothing below 12px, and 12px is for labels only. Body copy is 15-16px.
**The One Headline Rule.** One Headline per page; everything else is Title or Label.

## Layout

A fixed **rail** on the left, always 232px wide (there is no narrower tablet rail), and a main area that holds content up to 1240px, left-aligned. The user name, avatar, theme toggle and Log out sit at the bottom of the rail; the rail is the app's navigation bar (there is no separate top navbar on desktop, and at 960px and below the rail becomes the top bar, so the toggle lives there too). Page padding is 36px on wide screens and shrinks smoothly with the window (3% of its width, so 19-36px between 640 and 1200px wide); at 640px and below it is a fixed 16px.

Spacing is a 4px base scale: 4, 8, 12, 16, 24, 32. Modules sit 12px apart, sections 24px apart, and there is more space above a heading than below it. Table rows are 48px tall minimum; touch targets are 44px.

**Dashboard order:** title and subtitle, seven stat modules (Total, then Saved, Applied, OA, Interview, Offer, Rejected, so the six statuses always add up to the Total), one toolbar row (search grows, then status select, sort select, Add job), the ranked table, then pagination.

**Responsive:**
- Above 1100px: the rail is at the left and the seven stat modules sit in one row.
- 1100px and below: the stat modules wrap to two rows of four, with Total twice as wide (seven modules in one row would be too narrow for their labels).
- 960px and below (tablet and phone share this layout): the rail becomes a top bar that stays at the top while scrolling. The logo mark and wordmark are on the left; the icon-only nav (44px targets) is pushed to the right, followed by the theme toggle and Log out. The avatar and name are hidden (there is no avatar menu). Buttons and inputs become 44px tall, and the job table turns into stacked rows (see 375px below).
- 640px and below (phone): the wordmark is hidden (logo mark only), page padding is 16px and the headline is 1.5rem. The stat modules go to two columns, with Total across the full first row. In the toolbar, search takes a full row, the status and sort selects share a row, and Add job takes a full row. Two-field form rows stack, and Save and Cancel share a row.
- 375px (the floor): table rows are stacked fixtures (CSS grid on each row, header row and rank hidden): the top line is company with the Edit and Delete buttons; the second line is position (with location under it); the third line is status tag, pips and deadline. No horizontal scrolling of the page or the table.
- Forms are single column; the two-field rows stack at 640px and below.
- Auth pages: at 900px and up a deep-teal brand panel (logo, one-line promise) sits beside the form; below that it becomes a teal strip above the form.

## Elevation & Depth

Flat by default. Depth comes from hairline borders (1px `#d5e3e2`), tonal steps (page grey behind white modules, tab tint on headers) and the teal rail. No resting shadows anywhere.

- **Modal** (`box-shadow: 0 16px 40px rgba(15, 23, 42, 0.25)`): the only shadow, on the confirmation popup, over a `rgba(15, 23, 42, 0.5)` overlay.
- **Focus ring** (`box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.3)` plus a `--focus-line` border): inputs and buttons. Buttons, links and icon buttons also get a 2px `--focus-line` outline with 2px offset; rail items keep a white outline. `--focus-line` is `#0f766e` in light (5.5:1 on white) and `#14b8a6` in dark (6.8:1). The lighter `#14b8a6` measured only 2.5:1 on white, so it is no longer used for focus in the light theme.

**The Hairline Rule.** Separate with a 1px line, not a shadow. If something needs to feel raised, it is a modal.

## Shapes

Crisp and small. Tags 4px, pips 2px (they are only 8px tall, so 4px would turn them into pills), modules, inputs, buttons and the table 6px, modal and auth card 10px. Avatars and the empty-state tile are the only fully round or large shapes. Borders are always 1px; the zone stripe (4px) and rail link are the only thick marks.

## Components

### Buttons
- **Primary:** Action Teal fill, white text, 6px radius, 40px tall, 600 weight, icon (16px) before the label when useful. Hover goes to `#115e59`; press scales to 0.97; focus ring as above. Disabled is 60% opacity, no hover, `cursor: not-allowed`. While saving, the label stays and a small white spinner replaces the icon.
- **Outline:** white fill, Action Teal text, 1px `#b8cfcd` border; hover tints to Mint Wash.
- **Danger:** `#b91c1c` fill, white text; used only in the delete confirmation.
- **Icon button:** 36px square on desktop, 44px on touch, transparent; hover Mint Wash (danger variant: red-tint). Always has `aria-label`.

### Inputs / Fields
- 42px tall, white, 1px Field Border, 6px radius. Hover darkens the border slightly. Focus: teal border plus the ring.
- Label sits above (600, 14px). Error text sits directly under the field in Overdue Red with an icon, and the field gets a red border. Helper text is Ink Muted.
- Search has a leading icon; selects are native `<select>`.

### Stat modules
A white 6px module with a 1px hairline. A header tab (Tab Tint, Label type, 5px 12px) names the metric; below it sits the Display number with tabular figures. While loading, the number is a grey skeleton block of the same size. The Dashboard shows seven (Total plus one per status, in pipeline order); the Statistics page shows its own five (Total, Active, Interview, Offer, Rejected).

### Job table (the signature)
A real `<table>` in a hairline-bordered white module. Header row is Tab Tint with Label type.
- **Zone stripe:** 4px left border in the status colour, then the **rank** (condensed, muted) showing the row's place in the current sort.
- **Company** 600 with position beneath on narrow screens; **Status tag**: 4px radius, tinted background, status text; **Pips**: five 16x8px bars with a 2px radius, filled up to the stage (Saved 1, Applied 2, OA 3, Interview 4, Offer 5) in Brand Teal, Offer all five in Offer green. Unfilled pips are 1px outlines in Field Border (3:1), not a pale fill. Container has `role="img"` and an `aria-label` such as "Stage 3 of 5: OA".
- **Rejected** shows five empty pips with red-tinted outlines and the company name struck through in muted ink. The data does not record how far a job got, so never fill pips for a stage it did not reach.
- **Deadline:** date, then a hint line. Vocabulary: upcoming ("In 12 days", muted), due soon ("In 3 days", "Tomorrow", Soon Amber plus clock icon), overdue ("2 days overdue", Overdue Red plus alert icon), done (Offer and Rejected keep their date in muted text with no hint; a job with no deadline shows a dash). Location sits under the position in muted text, and the row's rank continues across pages. Thresholds stay as already coded in `utils/format.js`.
- Hover tints the row Mint Wash (on hover-capable pointers only). Edit and Delete icon buttons sit at the row end.

### Navigation (rail)
Deep Rail Teal, 232px. Logo mark and wordmark at top. Links are 40px rows with a 20px icon and label, 6px radius; default `#b7e4de`, hover `rgba(255,255,255,0.08)`, active Light Teal fill with `#04201e` text (600). The page you are on also has `aria-current="page"`. User block at the bottom: avatar (34px round), name (it may wrap to two lines before it is cut off with an ellipsis), then two icon buttons: theme toggle and Log out. At 960px and below it becomes a top bar with icon-only links, the theme toggle and Log out; the avatar and name are hidden (see Layout, Responsive).

### Theme toggle
An icon button (sun or moon, 18px, drawn from the existing inline SVG set) with a 44px touch target, in the rail's user block next to Log out. It shows the icon of the theme you will get: a moon in light mode, a sun in dark mode. It has an `aria-label` and a `title` that say the action ("Switch to dark mode" / "Switch to light mode"), a visible focus ring, and sidebar-style hover (`rgba(255,255,255,0.08)`). Clicking applies the theme at once and saves it in `localStorage`. It is the only control that changes the whole page's colours, so it does not animate.

### Auth pages
Deep Rail Teal panel with the logo and one line ("Know where every application stands."), form on a white card at 10px radius. The "Try the demo account" button is an outline button directly under Log in, never buried.

### States (every page needs all three)
- **Loading:** skeleton blocks in the exact shape of the content (stat numbers, five table rows, chart frames). If the first request takes over 4 seconds, add a line under the skeleton: "Waking the server. Free hosting can take up to a minute on the first visit." Buttons disable and show the small spinner while saving.
- **Empty:** a 56px Mint Wash tile with an icon, a Title, one sentence of help and a primary button (for the dashboard: "No applications yet" and "Add your first job"). A filtered-empty result says "No matching jobs" and offers Clear filters.
- **Error:** a red-tinted alert (error background, a full 1px error border, an alert icon before the sentence) with a plain sentence and a Try again button. No one-sided accent bar. 404 uses a large condensed "404" in Brand Teal with a Back to dashboard button.

### Confirmation modal
10px radius white panel, Title, one muted sentence naming the job, Cancel (outline) and Delete (danger). Focus moves into the modal, Escape closes it, focus returns to the trigger. Overlay as in Elevation.

### Toast
A short confirmation after a job is added ("Job added"), edited ("Changes saved") or deleted ("Job deleted"). It uses the success colours (`--success` text on `--success-bg`, `--success-line` border, 6px radius, a check icon before the text), so it follows the theme. No shadow (hairline rule). It sits at the bottom right above 960px and along the bottom edge, centred, at 960px and below. It stays for 5 seconds or until the small close button (36px, 44px on touch) is pressed, and a newer message replaces it. It lives above the router, so a message set just before the app goes back to the dashboard is still shown there. The region that holds it is always on the page with `role="status"`, so screen readers announce the text without moving the keyboard focus. Errors never use a toast: they stay in the red alert on the page.

### Charts (Statistics)
Each chart sits in a module with a header tab. Pie by status uses the six status colours with a text legend that lists each status and its count (colour is never the only label). Bar chart per month uses Brand Teal bars, `#e5eeed` horizontal gridlines only, 12px Ink Muted axis labels, and a tooltip with a 1px hairline border and 6px radius. No 3D, no gradients, no decorative legends. Both charts animate once on mount (300ms, ease-out), and never re-animate on re-render.

## Motion

Motion confirms, it does not decorate. This is a tool opened many times a day, so almost nothing moves.

**Tokens (in `index.css`):** `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`; `--dur-fast: 120ms`; `--dur: 180ms`. Every duration in the CSS uses one of these two; the only plain millisecond value is the 200ms delay before the table dims.

| Moment | Purpose | Motion |
| --- | --- | --- |
| Button, icon button press | Feedback | `transform: scale(0.97)`, `--dur-fast`, `--ease-out` |
| Link, rail hover | Feedback | background/colour only, `--dur-fast`, hover-capable pointers only |
| Table row hover | (none) | instant background tint; rows are scanned quickly, so no fade |
| Input focus | State | border colour fades in `--dur-fast`; the ring appears at once |
| Search, filter, sort, page change | Preventing a jarring change | after a 200ms delay (so fast responses never flicker), existing rows dim to 55% opacity in `--dur-fast` while the next page loads; coming back to full opacity is instant; no sliding |
| Toast appears | Confirming an action | `opacity 0 -> 1` and `translateY(8px) -> none` in 180ms, `--ease-out`. It leaves by itself after 5s, or at once when dismissed (reduced motion: opacity only) |
| Confirmation modal open | Spatial consistency | overlay fades in `--dur-fast`; panel `opacity 0 -> 1` and `translateY(8px) scale(0.98) -> none` in 180ms, `--ease-out`. Closing is instant |
| Theme switch | (none) | instant colour change, no cross-fade, no transition on the whole page |
| Skeleton | State | a lighter band sweeps across with `transform: translateX` on an `::after` layer, 1.2s linear loop |
| Spinner | State | rotation, 0.7s linear (stays on under reduced motion) |
| Empty state, first view | Rare tier | single `--dur` fade-up (8px), once |
| Charts | State | one mount animation, 300ms, ease-out. The hover tooltip is not animated |

**Never:** keyboard-driven actions animate; `transition: all`; `scale(0)`; `ease-in`; animating width, height, margin or top/left; page-load staggers on the table; bouncing, confetti, or celebration on an Offer.
Only `transform`, `opacity`, `background-color`, `color` and `border-color` are ever transitioned, each named explicitly.

**Reduced motion:** under `prefers-reduced-motion: reduce`, drop transforms, shimmer and the empty-state fade-up; keep opacity fades and the spinner. (The current global rule that sets every duration to 0.01ms also freezes the spinner and must be narrowed during the build.)

## Do's and Don'ts

### Do:
- **Do** show every status as stripe, tag and pips together, with the tag text always present.
- **Do** write deadlines in words with an icon: "2 days overdue", "In 3 days".
- **Do** use tabular figures for every number so digits line up in columns.
- **Do** keep design tokens as semantic CSS variables at the top of `client/src/index.css`, with a light set in `:root` and a dark set in `:root[data-theme="dark"]`; no raw hex or `rgba()` in component rules, chart props or inline styles.
- **Do** check every new colour pair in both themes: 4.5:1 for text, 3:1 for stripes, pips, chart marks and input outlines.
- **Do** keep every page working at 375px with a designed empty, loading and error state.
- **Do** keep contrast at 4.5:1 or better for text, 3:1 for pips, stripes and chart marks against their backgrounds.

### Don't:
- **Don't** use shadows on cards or tables; borders only (the modal is the exception).
- **Don't** put white text on `#0d9488`; use Action Teal `#0f766e` for fills (in dark mode the fill is `#14b8a6` with `#04201e` text).
- **Don't** invert the light theme to make the dark one. Dark surfaces are tinted teal-grey, never pure black, and accents are the lighter teal steps.
- **Don't** fill pips for stages a job never reached, or encode urgency in the zone stripe.
- **Don't** use pill-shaped (fully rounded) status badges, gradient logos, glass or glow effects.
- **Don't** add icon-only controls without an `aria-label`, or hide meaning behind hover.
- **Don't** pull in Tailwind, a UI library or an icon font; plain CSS and the existing inline SVG icons only.
