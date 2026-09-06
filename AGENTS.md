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
source of truth for how to write code in this repo. **Read the relevant
file(s) before making changes**, don't rely on general framework knowledge
alone — several dependencies here (Next.js 16, Clerk 7, Tailwind v4,
Drizzle 1.0) are recent major versions with behavior that differs from
older, more commonly-seen versions. ALWAYS refer to the relevant .md file BEFORE generating any code:

- **[Authentication Guidelines](docs/authentication.md)** - Clerk Integration, route protection, and auth patterns

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
