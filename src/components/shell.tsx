import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";

export function Shell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="bg-reticle min-h-dvh">
      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <Link
          to="/"
          className="font-mono text-sm tracking-[0.22em] text-fg uppercase"
        >
          Scope
        </Link>
        <p className="hidden text-xs text-muted sm:block">Remote diagnostics</p>
      </header>
      <div className={cn("px-5 pb-16 sm:px-8", className)}>{children}</div>
    </div>
  );
}

export function BackLink({ to = "/", label = "Back" }: { to?: string; label?: string }) {
  return (
    <Link
      to={to}
      className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-opacity duration-[var(--motion-quick)] hover:text-fg"
    >
      <ArrowLeft className="size-4" strokeWidth={1.75} />
      {label}
    </Link>
  );
}
