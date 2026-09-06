import { SignUpButton } from "@clerk/nextjs";
import { BarChart3, Link2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Link2,
    title: "Custom short links",
    description:
      "Turn long, messy URLs into short, memorable links you can share anywhere.",
  },
  {
    icon: Zap,
    title: "Fast redirects",
    description:
      "Every short link resolves instantly, so visitors never feel a delay.",
  },
  {
    icon: BarChart3,
    title: "Click analytics",
    description:
      "See how many times each link was clicked and track its performance over time.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description:
      "Sign in with Clerk to manage your links — only you can edit or delete them.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-background px-6">
      <section className="flex flex-col items-center gap-6 py-24 text-center">
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
      </section>
      <section className="grid w-full max-w-4xl grid-cols-1 gap-4 pb-24 sm:grid-cols-2">
        {features.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardHeader>
              <Icon className="size-6 text-primary" />
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  );
}
