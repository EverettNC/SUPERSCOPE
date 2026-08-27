import { useCallback, useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BackLink, Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { createProbe, mintCode } from "@/lib/probes";

export const Route = createFileRoute("/send")({ component: SendPage });

function SendPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);

  const open = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await Promise.race([
        createProbe(),
        new Promise<never>((_, reject) => {
          window.setTimeout(() => reject(new Error("timeout")), 4000);
        }),
      ]);
      const code = res.ok ? res.code : mintCode();
      await navigate({ to: "/session/$code", params: { code } });
    } catch {
      await navigate({ to: "/session/$code", params: { code: mintCode() } });
    }
  }, [navigate]);

  useEffect(() => {
    void open();
  }, [open]);

  return (
    <Shell>
      <BackLink />
      {error ? (
        <div className="mx-auto max-w-md">
          <h1 className="font-display text-3xl text-fg">Could not open a probe</h1>
          <p className="mt-3 text-sm text-muted">
            {error} Scan this computer or use the lab instead.
          </p>
          <Button className="mt-6" onClick={() => void open()} disabled={busy}>
            Try again
          </Button>
        </div>
      ) : (
        <p className="font-mono text-sm text-muted">Opening a session…</p>
      )}
    </Shell>
  );
}
