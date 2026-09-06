# Database Conventions (Drizzle ORM + Neon)

## Stack

- **Postgres** hosted on **Neon** (serverless), accessed via
  `@neondatabase/serverless`.
- **Drizzle ORM** (`drizzle-orm`) is the only data-access layer — do not add
  a second ORM/query builder (e.g. Prisma) alongside it.
- **drizzle-kit** generates SQL migrations from `db/schema.ts` into
  `./drizzle`, configured in [drizzle.config.ts](/Users/achyutanantapanda/Documents/MERN/link-shortner/drizzle.config.ts).

## The client

Always import the shared client from `@/db`, never instantiate a second
`drizzle(...)` client elsewhere:

```ts
import { db } from "@/db";
```

`db/index.ts` uses the Neon **HTTP** driver
(`drizzle-orm/neon-http`), which is stateless/serverless-friendly — this is
intentional for the Next.js server runtime. Don't switch it to a pooled
`node-postgres`/websocket driver without discussing the tradeoffs first
(connection pooling behaves differently in serverless).

## Schema

- `db/schema.ts` is the single source of truth for the database shape.
  Define tables with `pgTable` from `drizzle-orm/pg-core`.
- Derive TypeScript types from the schema instead of duplicating them:

  ```ts
  import type { links } from "@/db/schema";

  type Link = typeof links.$inferSelect;
  type NewLink = typeof links.$inferInsert;
  ```

- Add explicit constraints in the schema (not just app-level checks) for
  invariants that matter — e.g. a unique index on a short-link slug column.
- Every schema change must be followed by generating a migration:

  ```bash
  npx drizzle-kit generate
  ```

  Do not hand-write SQL migration files; let drizzle-kit generate them from
  the schema, and commit the generated files under `./drizzle`.
- Use `npx drizzle-kit push` only for local/throwaway iteration, never as a
  substitute for committed migrations in real changes.

## Queries

- Prefer Drizzle's typed query builder (`db.select()...`, `db.insert()...`)
  over raw SQL strings; drop to `sql\`...\`` only for things the builder
  can't express, and keep those isolated/commented.
- Keep query logic in `db/` (or a colocated server-only module) rather than
  inline in client components — queries must only ever run on the server.
- Validate/parse untrusted input (e.g. a user-submitted destination URL or
  custom slug) before it reaches a query; don't rely on the database
  constraint alone to reject bad data — fail with a clear error earlier.
