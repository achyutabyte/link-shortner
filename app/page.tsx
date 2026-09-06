import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Shorten your links. Share them anywhere.
      </h1>
      <p className="max-w-md text-lg text-muted-foreground">
        Create short, memorable links in seconds and keep track of them all
        in one place.
      </p>
      <SignUpButton mode="modal">
        <Button size="lg">Get started</Button>
      </SignUpButton>
    </div>
  );
}
