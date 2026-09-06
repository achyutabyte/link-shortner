---
description: "Code quality standards, ESLint 9 linting, TypeScript type checking, formatting rules, scripts reference, and change hygiene"
applyTo: "**/*.{ts,tsx,js,mjs,json,css,md}"
---

# Code Quality & Tooling

## Linting

- ESLint 9 flat config (`eslint.config.mjs`), extending `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
- Run before considering any change done:

  ```bash
  npm run lint
  ```

- Fix reported issues rather than adding `eslint-disable` comments, unless the rule is a false positive — in that case disable the narrowest possible scope (single line, not the whole file) and leave a short comment explaining why.

## Type Checking

There's no separate `typecheck` script; `next build` (and the editor's TS server) surface type errors. For a quick check without a full production build, use:

```bash
npx tsc --noEmit
```

## Formatting

There is no dedicated formatter config (no Prettier config file) — match the formatting already present in the surrounding code (2-space indentation, double quotes in `.tsx`/`.ts`, trailing commas as seen in existing files) if introducing a formatter is not part of the task.

## Testing

No test framework is configured yet. Do not introduce one speculatively. If a task explicitly requires tests, ask which framework to add (e.g. Vitest/Playwright) rather than assuming one.

## Commands Reference

```bash
npm run dev                # start dev server (localhost:3000)
npm run build              # production build
npm run start              # run production build
npm run lint               # ESLint
npx drizzle-kit generate   # generate SQL migrations from db/schema.ts
npx drizzle-kit push       # push schema directly (local/dev iteration only)
```

## General Change Hygiene

- Keep diffs scoped to the task — don't reformat or refactor unrelated code.
- Don't hand-edit the auto-generated Next.js agent-rules block in `AGENTS.md` (between the `BEGIN:nextjs-agent-rules` / `END:nextjs-agent-rules` markers) — `next dev` regenerates it, and edits there will be overwritten.
- When adding a new cross-cutting convention, update the relevant instruction file in `.github/instructions/` rather than only applying it once — these instructions are the shared source of truth for both humans and coding agents.
