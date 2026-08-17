# AstroLive

AstroLive is an insight-first astrology consultation prototype for AstroHack 2026. A user describes a concern in their own words; AstroLive produces a deterministic, explainable interpretation, recommends a relevant specialist, and prepares a Session Brief for a prototype consultation.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Tailwind CSS component primitives

## Demo flow

1. Share a concern on **Understanding You**.
2. Review the deterministic interpretation, confidence, and supporting observations.
3. Explore the recommended specialist and trust evidence.
4. Select a fixture consultation time; no payment, live availability lookup, or real reservation is made.
5. Open the Session Brief, which carries the selected specialist and prototype time forward.

The prototype uses browser session storage for the active journey. Starting a fresh browser session clears the current concern, recommendation, booking, and Session Brief.

## Project Structure

The project uses the Next.js App Router. Application routes live in `app/`, reusable UI lives in `components/`, and supporting code is organized by purpose.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Validation

1. Review and document research in `docs/`.
2. Make focused changes in a dedicated branch.
3. Validate changes before sharing:

   ```bash
   npm run typecheck
   npm run lint
   npm run build
   npx vitest run
   ```

## Folder Structure

```text
app/          Application routes and layouts
components/   Reusable UI components
docs/         Hackathon documentation and supporting assets
hooks/        Reusable React hooks
lib/          Shared utilities and configuration
public/       Static files
types/        TypeScript type definitions
utils/        General utility functions
```

## Prototype boundaries

- No sign-up, accounts, saved profiles, or dashboard.
- No payments, live booking, or real-time availability.
- Specialist portraits and appointment times are clearly marked fixture/demo data.
- The Insight Engine is deterministic and exposes user-facing explanations, not internal rule or scoring details.

## Submission materials

Supporting research and report-outline documents are in `docs/`. Before submission, add the final public prototype URL, team details, report PDF link, and source/AI-tool citations required by the challenge.
