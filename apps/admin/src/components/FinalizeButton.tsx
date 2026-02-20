"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function FinalizeButton({ cupId }: { cupId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFinalize = async () => {
    if (!confirm("結果を確定しますか？確定後は変更できません。")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/cups/${cupId}/finalize`, {
        method: "POST",
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
      onClick={handleFinalize}
      disabled={loading}
      className={cn(
        "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
        "bg-green-600 text-white hover:bg-green-700",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    >
      {loading ? "処理中..." : "結果を確定する"}
    </button>
  );
}
