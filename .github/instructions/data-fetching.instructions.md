---
description: "Data fetching, mutation, and database access conventions for Next.js 16 App Router, Drizzle ORM, and Server Actions"
applyTo: "app/**/*.{ts,tsx},db/**/*.{ts,tsx}"
---

# Data Fetching & Mutation Conventions

## Core Principles

- **Server Components by Default**: Fetch data directly inside async Server Components (`app/**/page.tsx`, `app/**/layout.tsx`).
- **No Client `useEffect` Fetching**: Do not use `useEffect` or client-side fetch for internal application state when Server Components or Server Actions can handle it.
- **Drizzle ORM for Data Access**: Perform database queries using the shared `db` client from `@/db` and schema from `@/db/schema`.

## Server-Side Data Fetching

1. **Direct Queries in Server Components**:
   - Query Postgres via Drizzle typed query builder directly in `async` Server Components.
   - Always verify and scope user data using Clerk server auth (`await auth()`).

   ```tsx
   import { auth } from "@clerk/nextjs/server";
   import { eq, desc } from "drizzle-orm";
   import { db } from "@/db";
   import { links } from "@/db/schema";

   export default async function DashboardPage() {
     const { userId } = await auth();
     if (!userId) return null;

     const userLinks = await db
       .select()
       .from(links)
       .where(eq(links.userId, userId))
       .orderBy(desc(links.createdAt));

     return <DashboardView links={userLinks} />;
   }
   ```

2. **Route Parameters**:
   - In Next.js 16, `params` and `searchParams` are Promises — always `await` them.
   - Type props with global `PageProps<'route'>` or `LayoutProps<'route'>`.

   ```tsx
   export default async function RoutePage({ params }: PageProps<"/[slug]">) {
     const { slug } = await params;
     // ...
   }
   ```

## Mutations & Server Actions

1. **Colocated Server Actions**:
   - Use Server Actions (`"use server"`) for mutations (create, update, delete).
   - Colocate actions in `actions.ts` within the respective route folder (e.g., `app/dashboard/actions.ts`).
   - Validate inputs rigorously and revalidate paths with `revalidatePath("/path")` after mutations.

   ```ts
   "use server";

   import { auth } from "@clerk/nextjs/server";
   import { revalidatePath } from "next/cache";
   import { db } from "@/db";
   import { links } from "@/db/schema";

   export async function createLink(formData: FormData) {
     const { userId } = await auth();
     if (!userId) throw new Error("Unauthorized");

     const rawUrl = formData.get("url");
     if (typeof rawUrl !== "string" || !rawUrl.trim()) {
       throw new Error("URL is required");
     }

     await db.insert(links).values({
       userId,
       slug: generateSlug(),
       url: rawUrl.trim(),
     });

     revalidatePath("/dashboard");
   }
   ```

## Route Handlers (`route.ts`)

- Use `app/<route>/route.ts` exclusively for external/public endpoints (e.g. `app/[slug]/route.ts` for short-link redirection, webhook receivers, or public API endpoints).
- Keep route handlers thin: validate input, invoke database helpers, and return appropriate `NextResponse` / redirects.
