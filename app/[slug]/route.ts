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

    if (!slug) {
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

    await db
        .update(links)
        .set({ clicks: sql`${links.clicks} + 1` })
        .where(eq(links.id, link.id));

    return NextResponse.redirect(link.url, 307);
}
