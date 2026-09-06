"use client";

import { useState, useTransition } from "react";
import { Check, Copy, Loader2, Pencil, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteLink, updateLink } from "@/app/dashboard/actions";

type LinkActionsProps = {
    id: string;
    slug: string;
    url: string;
};

export function LinkActions({ id, slug, url }: LinkActionsProps) {
    const [copied, setCopied] = useState(false);
    const [shared, setShared] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editUrl, setEditUrl] = useState(url);
    const [editSlug, setEditSlug] = useState(slug);
    const [editError, setEditError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const getFullUrl = () => {
        if (typeof window !== "undefined") {
            return `${window.location.origin}/${slug}`;
        }
        return `/${slug}`;
    };

    const handleCopy = async () => {
        const fullUrl = getFullUrl();
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback if clipboard API is restricted
            const textarea = document.createElement("textarea");
            textarea.value = fullUrl;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShare = async () => {
        const fullUrl = getFullUrl();
        if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
            try {
                await navigator.share({
                    title: `Short link /${slug}`,
                    url: fullUrl,
                });
            } catch (error) {
                if (error instanceof Error && error.name !== "AbortError") {
                    await handleCopy();
                }
            }
        } else {
            await handleCopy();
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        }
    };

    const handleOpenEdit = () => {
        setEditUrl(url);
        setEditSlug(slug);
        setEditError(null);
        setIsEditOpen(true);
    };

    const handleOpenDelete = () => {
        setDeleteError(null);
        setIsDeleteOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEditError(null);

        startTransition(async () => {
            const formData = new FormData();
            formData.append("id", id);
            formData.append("url", editUrl);
            formData.append("slug", editSlug);

            const result = await updateLink(formData);
            if (result?.error) {
                setEditError(result.error);
            } else {
                setIsEditOpen(false);
            }
        });
    };

    const handleDelete = async () => {
        setDeleteError(null);

        startTransition(async () => {
            const formData = new FormData();
            formData.append("id", id);

            const result = await deleteLink(formData);
            if (result?.error) {
                setDeleteError(result.error);
            } else {
                setIsDeleteOpen(false);
            }
        });
    };

    return (
        <>
            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={handleCopy}
                    title={copied ? "Copied!" : "Copy link"}
                    aria-label={copied ? "Link copied to clipboard" : "Copy short link"}
                >
                    {copied ? (
                        <Check className="size-3.5 text-green-600 dark:text-green-400" />
                    ) : (
                        <Copy className="size-3.5" />
                    )}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={handleShare}
                    title={shared ? "Link copied to share!" : "Share link"}
                    aria-label="Share short link"
                >
                    {shared ? (
                        <Check className="size-3.5 text-green-600 dark:text-green-400" />
                    ) : (
                        <Share2 className="size-3.5" />
                    )}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={handleOpenEdit}
                    title="Edit link"
                    aria-label="Edit short link"
                >
                    <Pencil className="size-3.5" />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={handleOpenDelete}
                    title="Delete link"
                    aria-label="Delete short link"
                    className="hover:text-destructive hover:border-destructive/30"
                >
                    <Trash2 className="size-3.5" />
                </Button>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit short link</DialogTitle>
                        <DialogDescription>
                            Update the destination URL or custom slug for this link.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor={`edit-url-${id}`}
                                className="text-xs font-medium text-foreground"
                            >
                                Destination URL
                            </label>
                            <Input
                                id={`edit-url-${id}`}
                                type="url"
                                value={editUrl}
                                onChange={(e) => setEditUrl(e.target.value)}
                                placeholder="https://example.com/your-destination"
                                maxLength={2048}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor={`edit-slug-${id}`}
                                className="text-xs font-medium text-foreground"
                            >
                                Custom slug
                            </label>
                            <div className="flex items-center">
                                <span className="inline-flex h-8 items-center rounded-l-lg border border-r-0 border-input bg-muted px-2.5 text-xs text-muted-foreground select-none">
                                    /
                                </span>
                                <Input
                                    id={`edit-slug-${id}`}
                                    type="text"
                                    value={editSlug}
                                    onChange={(e) => setEditSlug(e.target.value)}
                                    placeholder="custom-slug"
                                    maxLength={100}
                                    className="rounded-l-none"
                                    required
                                />
                            </div>
                        </div>

                        {editError && (
                            <p className="text-xs font-medium text-destructive">
                                {editError}
                            </p>
                        )}

                        <DialogFooter>
                            <DialogClose render={<Button type="button" variant="outline" disabled={isPending} />}>
                                Cancel
                            </DialogClose>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="size-3.5 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    "Save changes"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete short link</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-foreground">/{slug}</span>?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    {deleteError && (
                        <p className="text-xs font-medium text-destructive">
                            {deleteError}
                        </p>
                    )}

                    <DialogFooter>
                        <DialogClose render={<Button type="button" variant="outline" disabled={isPending} />}>
                            Cancel
                        </DialogClose>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="size-3.5 animate-spin" />
                                    <span>Deleting...</span>
                                </>
                            ) : (
                                "Delete link"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
