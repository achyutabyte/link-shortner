"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { links } from "@/db/schema";
import { generateSlug } from "@/lib/slug";

const MAX_SLUG_ATTEMPTS = 3;
const MAX_URL_LENGTH = 2048;
const MAX_SLUG_LENGTH = 100;

const RESERVED_SLUGS = new Set([
    "dashboard",
    "sign-in",
    "sign-up",
    "api",
    "trpc",
    "_next",
    "__clerk",
    ".well-known",
    "favicon.ico",
    "robots.txt",
    "sitemap.xml",
    "manifest.json",
    "public",
]);

function parseAndValidateUrl(rawUrl: unknown): URL {
    if (typeof rawUrl !== "string" || !rawUrl.trim()) {
        throw new Error("A destination URL is required");
    }

    const trimmed = rawUrl.trim();
    if (trimmed.length > MAX_URL_LENGTH) {
        throw new Error(`URL must not exceed ${MAX_URL_LENGTH} characters`);
    }

    let url: URL;
    try {
        url = new URL(trimmed);
    } catch {
        throw new Error("Enter a valid URL, including https://");
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("Only http:// and https:// URLs are allowed");
    }

    return url;
}

function validateSlug(rawSlug: unknown): string {
    if (typeof rawSlug !== "string" || !rawSlug.trim()) {
        throw new Error("A slug is required");
    }

    const cleanSlug = rawSlug.trim();
    if (cleanSlug.length > MAX_SLUG_LENGTH) {
        throw new Error(`Slug must not exceed ${MAX_SLUG_LENGTH} characters`);
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(cleanSlug)) {
        throw new Error("Slug can only contain letters, numbers, hyphens, and underscores");
    }

    if (RESERVED_SLUGS.has(cleanSlug.toLowerCase())) {
        throw new Error("This slug is reserved and cannot be used");
    }

    return cleanSlug;
}

export async function createLink(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const url = parseAndValidateUrl(formData.get("url"));

    // Slugs are random, so retry a couple of times on the rare collision.
    for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
        try {
            await db.insert(links).values({
                userId,
                slug: generateSlug(),
                url: url.toString(),
            });
            break;
        } catch (error) {
            if (attempt === MAX_SLUG_ATTEMPTS - 1) throw error;
        }
    }

    revalidatePath("/dashboard");
}

export async function updateLink(formData: FormData) {
    const { userId } = await auth();
    if (!userId) {
        return { error: "Unauthorized" };
    }

    const id = formData.get("id");
    if (typeof id !== "string" || !id.trim()) {
        return { error: "Link ID is required" };
    }

    let url: URL;
    try {
        url = parseAndValidateUrl(formData.get("url"));
    } catch (err) {
        return { error: err instanceof Error ? err.message : "Invalid URL" };
    }

    let cleanSlug: string;
    try {
        cleanSlug = validateSlug(formData.get("slug"));
    } catch (err) {
        return { error: err instanceof Error ? err.message : "Invalid slug" };
    }

    // Check if slug is already taken by another link
    const existing = await db
        .select({ id: links.id })
        .from(links)
        .where(eq(links.slug, cleanSlug))
        .limit(1);

    if (existing.length > 0 && existing[0].id !== id) {
        return { error: "This slug is already in use" };
    }

    const [updated] = await db
        .update(links)
        .set({
            url: url.toString(),
            slug: cleanSlug,
        })
        .where(and(eq(links.id, id), eq(links.userId, userId)))
        .returning();

    if (!updated) {
        return { error: "Link not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteLink(formData: FormData) {
    const { userId } = await auth();
    if (!userId) {
        return { error: "Unauthorized" };
    }

    const id = formData.get("id");
    if (typeof id !== "string" || !id.trim()) {
        return { error: "Link ID is required" };
    }

    const [deleted] = await db
        .delete(links)
        .where(and(eq(links.id, id), eq(links.userId, userId)))
        .returning();

    if (!deleted) {
        return { error: "Link not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    return { success: true };
}
