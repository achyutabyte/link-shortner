import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { ExternalLink } from "lucide-react";
import { db } from "@/db";
import { links } from "@/db/schema";
import { LinkActions } from "@/components/link-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createLink } from "./actions";

export default async function DashboardPage() {
    const { userId } = await auth();
    const userLinks = userId
        ? await db
            .select()
            .from(links)
            .where(eq(links.userId, userId))
            .orderBy(desc(links.createdAt))
        : [];

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-12">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Dashboard
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>Create a short link</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createLink} className="flex gap-2">
                        <Input
                            type="url"
                            name="url"
                            placeholder="https://example.com/your-long-link"
                            maxLength={2048}
                            required
                            className="flex-1"
                        />
                        <Button type="submit">Shorten</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
                {userLinks.length === 0 ? (
                    <p className="text-muted-foreground">
                        You haven&apos;t created any links yet.
                    </p>
                ) : (
                    userLinks.map((link) => (
                        <Card key={link.id}>
                            <CardContent className="flex items-center justify-between gap-4">
                                <div className="flex flex-col overflow-hidden">
                                    <a
                                        href={`/${link.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline"
                                    >
                                        <span className="truncate">/{link.slug}</span>
                                        <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
                                    </a>
                                    <span className="truncate text-sm text-muted-foreground">
                                        {link.url}
                                    </span>
                                </div>
                                <div className="flex shrink-0 items-center gap-3">
                                    <span className="text-sm text-muted-foreground">
                                        {link.clicks} clicks
                                    </span>
                                    <LinkActions id={link.id} slug={link.slug} url={link.url} />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

