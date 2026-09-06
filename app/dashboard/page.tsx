import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { links } from "@/db/schema";
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
                                    <span className="truncate font-medium text-foreground">
                                        /{link.slug}
                                    </span>
                                    <span className="truncate text-sm text-muted-foreground">
                                        {link.url}
                                    </span>
                                </div>
                                <span className="shrink-0 text-sm text-muted-foreground">
                                    {link.clicks} clicks
                                </span>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

