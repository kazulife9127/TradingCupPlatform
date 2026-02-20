"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CupStatus } from "@trading-cup/database";
import { cn } from "@/lib/utils";

const transitions: Partial<
  Record<CupStatus, { label: string; next: CupStatus; confirm: string }>
> = {
  DRAFT: {
    label: "公開する",
    next: "UPCOMING",
    confirm: "このCupを公開しますか？ユーザーに表示されるようになります。",
  },
  UPCOMING: {
    label: "開催する",
    next: "ACTIVE",
    confirm: "このCupを開催開始しますか？参加者のランキング集計が始まります。",
  },
  ACTIVE: {
    label: "終了する",
    next: "FINISHED",
    confirm: "このCupを終了しますか？結果が確定されます。",
  },
};

export function CupStatusActions({
  cupId,
  status,
}: {
  cupId: string;
  status: CupStatus;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const transition = transitions[status];

  if (!transition) return null;

  const handleTransition = async () => {
    if (!confirm(transition.confirm)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/cups/${cupId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: transition.next }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "エラーが発生しました");
        return;
      }

      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleTransition}
      disabled={loading}
      className={cn(
        "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
        "bg-primary text-primary-foreground hover:bg-accent",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    >
      {loading ? "処理中..." : transition.label}
    </button>
  );
}
