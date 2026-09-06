---
description: "Authentication and authorization conventions using Clerk in Next.js 16 (App Router), including proxy protection and Server Actions"
applyTo: "app/**/*.{ts,tsx},proxy.ts,components/**/*.{ts,tsx},lib/**/*.{ts,tsx}"
---

# Authentication Conventions (Clerk)

## Stack

- **Clerk is the only auth system in this app.** All authentication, session management, and sign-in/sign-up UI go through `@clerk/nextjs` (App Router integration) with `@clerk/ui` theming (`shadcn` theme, matching the app's shadcn/ui design system). Never add NextAuth/Auth.js, Passport, Lucia, custom JWT/session-cookie handling, or any other auth library or hand-rolled auth flow — even for one-off cases (e.g. a public API endpoint) — route those needs through Clerk (API keys, machine tokens, `auth.protect({ token: ... })`) instead.
- Sign-in/sign-up **always launch as a modal**, never a full-page navigation. Use `<SignInButton mode="modal">` / `<SignUpButton mode="modal">` (as in `app/layout.tsx`), or `useClerk().openSignIn()` / `openSignUp()` for programmatic triggers. Don't add `<Link href="/sign-in">` or `router.push("/sign-in")` style navigation for these flows.
- `app/sign-in/[[...sign-in]]/` and `app/sign-up/[[...sign-up]]/` (Clerk's **catch-all routes**) still exist and must not be deleted — Clerk itself can redirect to these paths (e.g. OAuth callbacks, account tasks, direct URL visits) — but they are a fallback, not the primary entry point. Don't build custom sign-in/sign-up forms.

## Provider & Layout

- `<ClerkProvider>` wraps the app once, in the root `app/layout.tsx`. Do not add a second `<ClerkProvider>` in nested layouts.
- Use Clerk's `<Show when="signed-in">` / `<Show when="signed-out">` components for conditional rendering by auth state, matching the existing header pattern, instead of manually checking session state with hooks when a declarative component will do.
- Pass `appearance={{ theme: shadcn }}` (from `@clerk/ui/themes`) to keep Clerk UI visually consistent with the rest of the app's shadcn/ui components — don't override Clerk's appearance with ad-hoc inline styles.

## Proxy-Level Auth

- Route protection/redirects that must happen before a page renders live in `proxy.ts` via `clerkMiddleware()` (Next.js 16 calls this file **Proxy**, not Middleware).
- When adding protected routes, use Clerk's `createRouteMatcher()` + `auth.protect()` inside the proxy callback rather than re-implementing redirect logic by hand. The existing `matcher` config in `proxy.ts` already runs the proxy on every route, so new protected paths only need an entry in the route matcher, not a `matcher` change.
- Proxy-level checks are for optimistic/coarse gating only. Still verify authorization (ownership of a given short link, etc.) server-side in the route handler/Server Action that performs the mutation.

### `/dashboard` is a Protected Route

- `/dashboard` (and any nested `/dashboard/*` routes) requires a signed-in user. Gate it in `proxy.ts` with `createRouteMatcher` + `auth.protect()`, not with client-side checks or a `<Show>` fallback — unauthenticated requests must never reach the page/layout:

  ```typescript
  import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

  const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

  export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect();
  });
  ```

- `auth.protect()` redirects signed-out users to the sign-in flow automatically — don't hand-write a redirect for this case.

### Signed-in Users Redirected Away from Homepage

- If a signed-in user requests `/`, the proxy must redirect them to `/dashboard` before the homepage renders (keep it in `proxy.ts` alongside other route-level auth logic):

  ```typescript
  export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();

    if (userId && req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (isProtectedRoute(req)) await auth.protect();
  });
  ```

- Signed-out users continue to see the marketing/landing homepage as normal.

## Server-Side Access

- In Server Components, Server Actions, and route handlers, get the current user/session via Clerk's server helpers (`auth()`, `currentUser()`) — never trust a client-supplied user ID for authorization decisions.
- Never expose Clerk secret keys to the client; only `NEXT_PUBLIC_CLERK_*` variables belong in client-visible code.
