import Link from "next/link";
import type { CupStatus } from "@trading-cup/database";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";

const statusConfig: Record<
  CupStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  DRAFT: {
    label: "下書き",
    dotClass: "bg-gray-400",
    badgeClass: "bg-muted text-muted-foreground",
  },
  UPCOMING: {
    label: "開催予定",
    dotClass: "bg-blue-400",
    badgeClass: "bg-blue-500/20 text-blue-400",
  },
  ACTIVE: {
    label: "開催中",
    dotClass: "bg-green-400 animate-pulse",
    badgeClass: "bg-green-500/20 text-green-400",
  },
  FINISHED: {
    label: "終了",
    dotClass: "bg-gray-500",
    badgeClass: "bg-muted text-muted-foreground",
  },
};

interface CupCardProps {
  id: string;
  title: string;
  status: CupStatus;
  pair: string;
  startAt: Date;
  endAt: Date;
  participantCount: number;
}

export function CupCard({
  id,
  title,
  status,
  pair,
  startAt,
  endAt,
  participantCount,
}: CupCardProps) {
  const config = statusConfig[status];

  return (
    <Link href={`/cup/${id}`} className="block group">
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:bg-card/80 group-active:scale-[0.98]">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-sm">{title}</h3>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
              config.badgeClass
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", config.dotClass)} />
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{pair}</span>
          <span>
            {formatDate(startAt)} - {formatDate(endAt)}
          </span>
          <span>{participantCount}名参加</span>
        </div>
      </div>
    </Link>
  );
}
