import { cn } from "@/lib/utils";
import type { CupStatus } from "@trading-cup/database";

const statusConfig: Record<CupStatus, { label: string; className: string }> = {
  DRAFT: {
    label: "下書き",
    className: "bg-gray-100 text-gray-700",
  },
  UPCOMING: {
    label: "開催予定",
    className: "bg-blue-100 text-blue-700",
  },
  ACTIVE: {
    label: "開催中",
    className: "bg-green-100 text-green-700",
  },
  FINISHED: {
    label: "終了",
    className: "bg-gray-200 text-gray-600",
  },
};

export function CupStatusBadge({ status }: { status: CupStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
