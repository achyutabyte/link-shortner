import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 justify-center px-6 py-16 sm:py-24">
      <div className="flex w-full max-w-6xl flex-col gap-16">
        <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <p className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
            Built for fast, reliable link sharing
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Shorten links and manage them in one secure dashboard.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            link-shortner helps you create clean URLs in seconds, organize them
            under your account, and share them confidently anywhere.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <SignUpButton mode="modal">
              <Button size="lg">Get started</Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button size="lg" variant="outline">
                I already have an account
              </Button>
            </SignInButton>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-card-foreground">
              Instant short links
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Create concise URLs quickly so your links are easy to paste,
              share, and remember.
            </p>
          </article>
          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-card-foreground">
              Personal dashboard
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Keep all of your links in one place with account-based access to
              your dashboard.
            </p>
          </article>
          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-card-foreground">
              Secure by default
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Authentication is built in, so your link management area stays
              protected.
            </p>
          </article>
        </section>

        <section className="mx-auto w-full max-w-4xl rounded-lg border border-border bg-card p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-card-foreground">
            How it works
          </h2>
          <ol className="mt-4 grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
            <li>
              <p className="font-medium text-card-foreground">1. Sign up</p>
              <p className="mt-1">
                Create your account in seconds using the sign-up button.
              </p>
            </li>
            <li>
              <p className="font-medium text-card-foreground">2. Shorten a URL</p>
              <p className="mt-1">
                Add a long link and get a clean, shareable short URL.
              </p>
            </li>
            <li>
              <p className="font-medium text-card-foreground">3. Manage links</p>
              <p className="mt-1">
                Track and organize all of your short links from your dashboard.
              </p>
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}
