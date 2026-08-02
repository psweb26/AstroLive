# AstroLive Product Innovation Prototype

AstroLive is a product innovation prototype being prepared for AstroHack 2026, a hackathon focused on exploring thoughtful improvements to the product experience.

## Objective

Document research findings and develop a validated product prototype for the AstroHack 2026 submission.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui conventions

## Project Structure

The project uses the Next.js App Router. Application routes live in `app/`, reusable UI lives in `components/`, and supporting code is organized by purpose.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Workflow

1. Review and document research in `docs/`.
2. Make focused changes in a dedicated branch.
3. Validate changes before sharing:

   ```bash
   npm run typecheck
   npm run build
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

## Current Project Status

Research and documentation setup are in progress.

## Team Members

<!-- Add team members here. -->

## License

This project is licensed under the [MIT License](LICENSE).
