# Next.js App Router Conventions

> **This project runs Next.js 16.** Next.js 16 has breaking changes vs. the
> Next.js you likely trained on (Pages Router habits, `middleware.ts`,
> synchronous `params`, etc.). When in doubt, read the docs shipped in
> `node_modules/next/dist/docs/` before writing code — don't rely on memory.

## Server Components by default

Every component under `app/` is a **Server Component** unless it starts with
`"use client"`. Default to Server Components:

- Only add `"use client"` when you need interactivity (event handlers,
  `useState`/`useEffect`, browser-only APIs) or a hook that requires it.
- Push `"use client"` as far down the tree as possible — wrap just the
  interactive leaf, not the whole page/layout.
- Server Components can be `async` and fetch data directly (Drizzle queries,
  `fetch`, etc.) — don't add a client-side `useEffect` fetch when a server
  component can do it.

## `params` and `searchParams` are Promises

In this Next.js version, dynamic route `params` and `searchParams` are always
`Promise`s and must be awaited, in both `page.tsx` and `layout.tsx`:

```tsx
export default async function ShortLinkPage({
  params,
}: PageProps<"/[slug]">) {
  const { slug } = await params;
  // ...
}
```

Use the **global `PageProps<'/route'>` and `LayoutProps<'/route'>` helper
types** (no import needed) instead of hand-writing prop types — they infer
`params`/`searchParams`/`children` from the actual route structure and stay
correct if the route changes. This repo's `app/layout.tsx` already does this
(`LayoutProps<"/">`). Follow the same pattern for every new `page.tsx` /
`layout.tsx`.

## Proxy, not Middleware

Next.js 16 renamed Middleware to **Proxy**. This repo has `proxy.ts` at the
root (sibling to `app/`), not `middleware.ts`. Rules:

- Never create a `middleware.ts` file — extend `proxy.ts` instead.
- Only one `proxy.ts` is supported per project. If proxy logic grows, split
  it into modules elsewhere and import them into `proxy.ts`; don't create a
  second proxy file.
- Proxy is for fast, request-scoped logic (auth redirects, header rewrites,
  A/B routing) — not slow data fetching. `fetch` caching options
  (`cache`, `next.revalidate`, `next.tags`) have no effect inside Proxy.
- Update the exported `config.matcher` when adding routes that must (or must
  not) run through Proxy, rather than adding conditionals that check the
  path manually inside the function.

## Route handlers

For API-style endpoints (e.g. link creation, redirect resolution, analytics
callbacks), use `app/<route>/route.ts` with named exports (`GET`, `POST`,
etc.) from `next/server`. Keep handlers thin — validate input, call into
`db/` or `lib/` helpers, return a `NextResponse`.

## Data fetching & mutations

- Prefer Server Components + Server Actions for mutations (link creation,
  editing, deletion) over client-side `fetch` to a route handler, unless the
  consumer is a third party (e.g. a public redirect endpoint).
- Co-locate a route's data access in the same file as the page/action when
  small; extract to `db/` when the same query is reused across routes.
- Do not fetch data in a Client Component with `useEffect` when a Server
  Component or Server Action can do it instead.

## Metadata

Every route that is user-facing (not an internal redirect) should export a
`metadata` object or `generateMetadata` function rather than manipulating
`document.title` on the client.

## Before writing Next.js-specific code

If a task touches caching (`use cache`, `revalidateTag`, ISR), auth
(`forbidden`/`unauthorized`), or routing conventions you're unsure about,
check the matching file in `node_modules/next/dist/docs/01-app/` first —
this version has changed enough that pre-16 knowledge can be actively wrong.
