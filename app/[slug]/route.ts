import { eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { links } from "@/db/schema";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    if (!slug || slug.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
        notFound();
    }

    const [link] = await db
        .select()
        .from(links)
        .where(eq(links.slug, slug))
        .limit(1);

    if (!link) {
        notFound();
    }

    // Defensive validation: ensure destination protocol is strictly http or https
    try {
        const parsedUrl = new URL(link.url);
        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
            notFound();
        }
    } catch {
        notFound();
    }

    await db
        .update(links)
        .set({ clicks: sql`${links.clicks} + 1` })
        .where(eq(links.id, link.id));

    return NextResponse.redirect(link.url, 307);
}
