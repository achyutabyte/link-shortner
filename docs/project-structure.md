# Project Structure & Aliases

This is a URL-shortener application built on Next.js App Router. There is no
`src/` directory — top-level folders are the routing/source roots.

```
app/                  # App Router routes (layouts, pages, route handlers)
  layout.tsx          # Root layout — wraps everything in <ClerkProvider>
  page.tsx            # Home page ("/")
  sign-in/[[...sign-in]]/   # Clerk catch-all sign-in route
  sign-up/[[...sign-up]]/   # Clerk catch-all sign-up route
components/
  ui/                 # shadcn/ui primitives (generated — see docs/ui-styling.md)
db/
  index.ts            # Drizzle client (Neon HTTP driver) — import `db` from here
  schema.ts           # Drizzle table definitions — single source of truth for the schema
lib/
  utils.ts            # Shared, framework-agnostic helpers (currently re-exports `cn`)
public/               # Static assets served from "/"
proxy.ts              # Next.js 16 Proxy (formerly "middleware") — Clerk auth runs here
drizzle.config.ts     # drizzle-kit config, generates migrations into ./drizzle
docs/                 # This directory — agent/contributor coding standards
```

## Path aliases

`tsconfig.json` and `components.json` define the `@/*` alias for the repo
root. Use it instead of relative `../../..` imports:

```ts
import { db } from "@/db";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

`components.json` (shadcn/ui config) declares these aliases — keep new code
consistent with them:

| Alias         | Path             |
| ------------- | ---------------- |
| `components`  | `@/components`   |
| `ui`          | `@/components/ui`|
| `lib`         | `@/lib`          |
| `hooks`       | `@/hooks`        |
| `utils`       | `@/lib/utils`    |

`@/hooks` does not exist yet — create it (`hooks/`) the first time a custom
hook is needed rather than inlining hooks under `components/`.

## Where new code belongs

- **Routes/pages/route handlers** → `app/`, following App Router file
  conventions (`page.tsx`, `route.ts`, `layout.tsx`, etc.).
- **Reusable, presentational UI primitives** → `components/ui/` (shadcn/ui
  style — see [ui-styling.md](./ui-styling.md)).
- **App-specific composed components** (e.g. a "create short link" form) →
  `components/` (not `components/ui/`).
- **Database schema/queries** → `db/` (see [database.md](./database.md)).
- **Framework-agnostic helpers** (slug generation, validation, formatting)
  → `lib/`.
- **Auth/redirect logic that must run before rendering** → `proxy.ts` (see
  [authentication.md](./authentication.md)).
