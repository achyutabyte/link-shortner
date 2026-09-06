# Agent & Contributor Documentation

This directory contains the coding standards and conventions for this
project, split by topic so they're easy for both humans and coding agents
to load selectively. `AGENTS.md` at the repo root is the entry point and
links here.

## Project

A link-shortener web app built with Next.js (App Router), Clerk
authentication, and a Postgres (Neon) database accessed through Drizzle
ORM. The project is early-stage: the schema (`db/schema.ts`) is not yet
defined and only the Clerk-provided auth pages exist beyond the default
Next.js starter page.

## Read in this order for a new task

1. [project-structure.md](./project-structure.md) — where things live, path
   aliases, what goes where.
2. [nextjs-conventions.md](./nextjs-conventions.md) — Next.js 16 / App
   Router specifics (Proxy, async `params`, Server Components).
3. [typescript-conventions.md](./typescript-conventions.md) — TS/React style
   rules.
4. [ui-styling.md](./ui-styling.md) — Tailwind v4 + shadcn/ui conventions.
5. [database.instructions.md](./database.instructions.md) — Drizzle ORM + Neon conventions.
6. [authentication.instructions.md](./authentication.instructions.md) — Clerk conventions.
7. [code-quality.instructions.md](./code-quality.instructions.md) — linting, type checking, commands,
   general change hygiene.

Not every task needs every file — e.g. a pure UI change only needs
`ui-styling.md` + `typescript-conventions.md`, while a schema change needs
`database.instructions.md` + `code-quality.instructions.md`.
