# Grand Finale Results + Prize Update — Design

**Date:** 2026-08-03
**Status:** Implemented autonomously (user was away during the brainstorming Q&A; every decision below is reversible and open to revision).

## Goal

1. Publish the Grand Finale results (from the shared Google Sheet, tab "Grand Finale") on the hackathon website.
2. Update the prize structure to five places: $500 / $250 / $125 / $75 / $50 (total unchanged: $1,000).

## Data source

Google Sheet `1pEGiZT9exooUJwaHARCVWJIB1Ld81-uaQjwq0VqafdY`, tab "Grand Finale": 25 finalists with Submission ID, team, track, project title, two judge scores (/120), average, and final rank.

## Decisions

- **Scope of published data:** Rank, team/participant name, project title, and track for all 25 finalists; prize amounts for the top 5. **Not published:** judge scores, judge assignments, internal notes, and submission/drive links (semi-sensitive; internal-only). Easy to add later if NSRI wants score transparency.
- **Placement:** New `#results` section on `index.html`, directly after the hero — no new page, because every page duplicates the full header/CSS inline and a fourth copy adds maintenance cost. Layout: featured full-width card for 1st place, a row of four cards for places 2–5, then a ranked table of all 25 finalists.
- **Discoverability:** New announcement bar on `index.html` (the `.announce` CSS already existed unused there); the existing announce bars on `judges.html` and `partners.html` are retargeted from the (now stale) participant-guide link to `index.html#results`; a "Results" link is added to desktop nav and mobile panel on all three pages.
- **Prizes section (`index.html#prizes`):** Three bars ($600/$300/$100) become five ($500/$250/$125/$75/$50, bar widths 100/50/25/15/10%). The per-row label changes from "Current Prize Structure" to "Awarded to <winner>". Heading becomes "Prize pool: $1,000"; the stale "pool may increase with registration" lede becomes "Awarded across the top five placements at the Grand Finale on July 25, 2026." Hero meta strip and SEO meta description change "$1,000+" to "$1,000". This also fixes a pre-existing inconsistency: the judging section promised "top five placements" while only three prizes were listed.
- **Styling:** Reuses the existing design system (tokens, `.eyebrow.gold`, card pattern, `.reveal` animation, mono labels). New CSS classes `.results-*` and `.winner-*` added to `index.html` only, next to the PRIZES block. Table scrolls horizontally in its own wrapper on small screens. `section[id]{scroll-margin-top:90px}` added so the sticky header no longer overlaps anchored headings.

## Data cleanup applied

- Trimmed stray whitespace/newlines in team names from the sheet.
- Rank 5 title: inserted an em dash between the title and its subtitle (they were on separate lines in the sheet cell).
- Rank 18 title converted from ALL CAPS to title case for display.
- Rank 12: collapsed a double space.
- **Rank 10 ("The Taylor"): the sheet's project-title cell contains the track name instead of a title — displayed as "Project title to be confirmed" pending the real title.** ← needs user follow-up.
- One sheet Notes cell contained pasted AI-prompt text; Notes were never intended for publication and are excluded.

## Out of scope (recommended follow-ups, not done)

- Post-event mode for the rest of the site: dead hero countdown, live Register CTAs with expired pricing, JSON-LD `eventStatus: EventScheduled`, future-tense copy.
- Registration form is non-functional (submits nowhere, payment link is `#`).
- Partners page duplicate/mangled card ("FinanceMeta<br>The Insilico Lab"); "5 days" vs July 13–18 (six days); "EST" vs EDT; judge LinkedIn URL oddities.

## Testing

- HTML parse check on all edited files.
- Adversarial verification pass (parallel review agents): data accuracy vs. spreadsheet, HTML/CSS validity (including a headless-Chromium render at 375–1280px), cross-page nav consistency, accessibility of the new table/cards.
- Verification outcomes applied: removed an unsupported "900+ participants" claim from the results lede (that stat belongs to the previous hackathon), rewrote meta/og/twitter descriptions in past-event framing, changed the hero abstract to past tense, and added table/region labelling for screen readers and keyboard scrolling. Data accuracy: all 25 rows verified clean against the sheet.
