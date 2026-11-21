---
version: 1
slug: "client-src-pages-dashboard-jsx"
primary_target: "client/src/pages/Dashboard.jsx"
related_targets: []
---

# Surface brief: TrackNest app screens (Dashboard first)

Scope: Operate mode. Whole logged-in app; Dashboard is the primary surface, other pages inherit.
Audience and job: students mid-recruiting-season; see what is pressing, update a job in seconds. Secondary: recruiters skimming the demo for a minute.
Unresolved: exact Statistics chart styling; Login/Register composition (inherits the world, not the rail).

## Direction contract

THESIS: The pipeline is a league table: every application has a rank, a zone stripe and a form guide. Refuses the category default of white cards with soft shadows and pill badges.
OWN-WORLD: Deep-teal rail (#0f3f3b), hairline-ruled modules with small tinted header tabs, Barlow Semi Condensed tabular numerals, status tags as small 4px-radius labels, a five-pip progress guide, row zone stripe, worded deadlines. Recognisable with content removed: teal rail, ruled tabs, pips.
STORY: The student sees what is overdue or due soon first, knows each job's stage without reading colours, adds or edits a job in one click. A recruiter sees a finished, consistent product.
FIRST VIEWPORT: Rail left (232px). Main: title, five stat modules with header tabs, one toolbar row (search, status, sort, Add job), then the ranked table: zone stripe, rank, company, position, status tag, pips, deadline with worded hint. Primary action Add job sits top right of the toolbar.
FORM: Assigned structure, position 4 of 7 grounded candidates, seed:f2bef305b930ee01. Raises: pips encode progress by length (from Labanotation), ruled header tabs (from Japanese density), a deadline vocabulary (from Transit).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
