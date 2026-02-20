"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function DisqualifyButton({
  cupId,
  participantId,
  walletAddress,
}: {
  cupId: string;
  participantId: string;
  walletAddress: string;
}) {
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleDisqualify = async (reason: string) => {
    const reasonLabel =
      reason === "DISQUALIFIED_DEPOSIT" ? "入出金検知" : "出来高未達";

    if (
      !confirm(
        `${walletAddress.slice(0, 8)}... を「${reasonLabel}」で失格にしますか？`
      )
    )
      return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/cups/${cupId}/participants/${participantId}/disqualify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "エラーが発生しました");
        return;
      }

      router.refresh();
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={loading}
        className={cn(
          "text-xs text-destructive hover:text-destructive/80 transition-colors",
          "disabled:opacity-50"
        )}
      >
        {loading ? "..." : "失格"}
      </button>
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-6 z-20 bg-card border border-border rounded-xl shadow-lg p-1 min-w-[160px]">
            <button
              onClick={() => handleDisqualify("DISQUALIFIED_DEPOSIT")}
              className="w-full text-left px-3 py-2 text-xs hover:bg-muted rounded-lg transition-colors"
            >
              入出金検知
            </button>
            <button
              onClick={() => handleDisqualify("DISQUALIFIED_VOLUME")}
              className="w-full text-left px-3 py-2 text-xs hover:bg-muted rounded-lg transition-colors"
            >
              出来高未達
            </button>
          </div>
        </>
      )}
    </div>
  );
}
