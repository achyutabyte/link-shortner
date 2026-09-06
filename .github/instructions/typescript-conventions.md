# TypeScript & React Conventions

## TypeScript

- `strict` mode is enabled (`tsconfig.json`) — do not weaken it (no adding
  `any` escape hatches, no `// @ts-ignore` to silence real type errors).
  Fix the underlying type instead.
- Prefer `type` aliases for props/data shapes; use `interface` only when you
  need declaration merging or are extending another interface.
- Don't use `any`. If a type is genuinely unknown, use `unknown` and narrow
  it, or derive the type from source of truth (e.g. `typeof schema.links.$inferSelect`
  from Drizzle — see [database.instructions.md](./database.instructions.md)) instead of hand-rolling a
  duplicate type.
- Let inference work for simple values; add explicit return types on
  exported functions and component props for readability and to catch
  accidental signature drift.
- Import types with `import type { ... }` (or inline `type` specifiers) when
  a symbol is type-only, to keep runtime bundles minimal — Next.js/TS will
  otherwise sometimes keep an unnecessary runtime import.

## React / components

- Function components only, no class components.
- One component per file for anything exported/reused; colocate small
  private subcomponents in the same file only if they're not reused
  elsewhere.
- Name component files and their default export consistently
  (`button.tsx` → `Button`, matching the existing `components/ui/` files).
- Props: destructure in the function signature, spread the remainder
  (`...props`) onto the underlying element, matching the pattern in
  [components/ui/button.tsx](/Users/achyutanantapanda/Documents/MERN/link-shortner/components/ui/button.tsx).
- Prefer composition (small components combined) over large components with
  many conditional branches.
- Keep components pure/presentational where possible; put data
  fetching/mutation logic in Server Components, Server Actions, or `db/`/`lib/`
  helpers rather than deep inside a client component.

## Imports

- Use the `@/*` path alias for cross-folder imports (see
  [project-structure.md](./project-structure.md)); use relative imports
  (`./foo`) only for files in the same folder.
- Group imports in the conventional order: external packages, then `@/*`
  internal modules, then relative imports. Let ESLint/the editor's organizer
  handle exact ordering — don't hand-fight it.

## Naming

- `camelCase` for variables/functions, `PascalCase` for
  components/types/interfaces, `SCREAMING_SNAKE_CASE` only for true
  constants (e.g. env-derived config).
- Files: `kebab-case.tsx`/`kebab-case.ts` (matches existing files like
  `button.tsx`, `drizzle.config.ts`).
- Route folders follow Next.js conventions (`[slug]`, `[[...catchAll]]`) —
  don't rename these to something non-standard.

## Environment variables

- Access server-only secrets (e.g. `DATABASE_URL`) only in server-side code
  (`db/`, Server Components, Server Actions, route handlers, `proxy.ts`) —
  never in a `"use client"` file.
- Client-exposed env vars must be prefixed `NEXT_PUBLIC_` per Next.js
  convention; don't invent another prefix.
- Fail fast on missing required env vars at the point of use, following the
  existing pattern in [db/index.ts](/Users/achyutanantapanda/Documents/MERN/link-shortner/db/index.ts)
  (throw a descriptive error rather than letting `undefined` propagate).
