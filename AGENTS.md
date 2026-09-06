<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

<!-- END:nextjs-agent-rules -->

# link-shortner — Coding Standards for Agents

This is a URL-shortener app: Next.js 16 (App Router) + React 19 + TypeScript
(strict), Clerk auth, Tailwind CSS v4 + shadcn/ui, and Postgres (Neon) via
Drizzle ORM.

> [!IMPORTANT]
> It is incredibly important that you \*\*ALWAYS read every relevant file in
> concurrently, not "if time allows". Never write or edit code from memory
> or general framework knowledge when a doc file covers that topic. If
> you're unsure whether a file is relevant, read it anyway; skipping this
> step is not acceptable.

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
