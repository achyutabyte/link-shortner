"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type LinkActionsProps = {
    slug: string;
};

export function LinkActions({ slug }: LinkActionsProps) {
    const [copied, setCopied] = useState(false);
    const [shared, setShared] = useState(false);

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

    return (
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
        </div>
    );
}
