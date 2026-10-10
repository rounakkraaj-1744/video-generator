import { IconBolt } from "@tabler/icons-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-[var(--text-primary)]">
      <span className="grid h-6 w-6 place-items-center rounded-md border border-[var(--border-strong)] text-[var(--text-secondary)]">
        <IconBolt size={16} stroke={1.5} />
      </span>
      {!compact && <span className="text-sm font-semibold tracking-tight">ReelForge</span>}
    </div>
  );
}
