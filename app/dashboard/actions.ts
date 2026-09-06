"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { links } from "@/db/schema";
import { generateSlug } from "@/lib/slug";

const MAX_SLUG_ATTEMPTS = 3;

export async function createLink(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const rawUrl = formData.get("url");
    if (typeof rawUrl !== "string" || !rawUrl.trim()) {
        throw new Error("A destination URL is required");
    }

    let url: URL;
    try {
        url = new URL(rawUrl);
    } catch {
        throw new Error("Enter a valid URL, including https://");
    }

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
