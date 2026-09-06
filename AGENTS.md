<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# link-shortner — Coding Standards for Agents

This is a URL-shortener app: Next.js 16 (App Router) + React 19 + TypeScript
(strict), Clerk auth, Tailwind CSS v4 + shadcn/ui, and Postgres (Neon) via
Drizzle ORM.

Detailed, topic-specific standards live in [docs/](./docs) and are the
source of truth for how to write code in this repo. Don't rely on general
framework knowledge alone — several dependencies here (Next.js 16, Clerk 7,
Tailwind v4, Drizzle 1.0) are recent major versions with behavior that
differs from older, more commonly-seen versions.

> [!IMPORTANT]
> It is incredibly important that you **ALWAYS read every relevant file in
> [docs/](./docs) BEFORE generating ANY code** — not after, not
> concurrently, not "if time allows". Never write or edit code from memory
> or general framework knowledge when a doc file covers that topic. If
> you're unsure whether a file is relevant, read it anyway; skipping this
> step is not acceptable.

- **[Project Structure](docs/project-structure.md)** - where things live, path aliases, what goes where
- **[Next.js Conventions](docs/nextjs-conventions.md)** - Next.js 16 / App Router specifics (Proxy, async `params`, Server Components)
- **[TypeScript Conventions](docs/typescript-conventions.md)** - TS/React style rules
- **[UI & Styling](docs/ui-styling.md)** - Tailwind v4 + shadcn/ui conventions
- **[Database](docs/database.md)** - Drizzle ORM + Neon conventions
- **[Authentication Guidelines](docs/authentication.md)** - Clerk Integration, route protection, and auth patterns
- **[Code Quality](docs/code-quality.md)** - linting, type checking, commands, general change hygiene

## Non-negotiables (summary)

- Don't create `middleware.ts` — this Next.js version uses `proxy.ts`
  ("Proxy"), which already exists at the repo root.
- `params`/`searchParams` in `page.tsx`/`layout.tsx` are Promises — `await`
  them, and type props with the global `PageProps<'route'>` /
  `LayoutProps<'route'>` helpers instead of hand-written prop types.
- All DB access goes through the shared `db` client in `@/db` and the
  schema in `db/schema.ts` (Drizzle ORM) — no second ORM, no ad-hoc SQL
  clients.
- Use the `@/*` import alias for cross-folder imports; don't add new path
  aliases without updating `tsconfig.json` and `components.json` together.
- Run `npm run lint` before considering a change complete.
- Don't hand-edit the auto-generated block above (between
  `BEGIN:nextjs-agent-rules` / `END:nextjs-agent-rules`) — `next dev`
  regenerates it.
