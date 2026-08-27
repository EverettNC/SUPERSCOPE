import { createFileRoute } from "@tanstack/react-router";
import { BackLink, Shell } from "@/components/shell";
import { ScanFlow } from "@/components/scan-flow";

export const Route = createFileRoute("/scan")({ component: ScanPage });

function ScanPage() {
  return (
    <Shell>
      <BackLink label="Home" />
      <ScanFlow targetName="This computer" />
    </Shell>
  );
}
