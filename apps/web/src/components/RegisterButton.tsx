"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function RegisterButton({ cupId }: { cupId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/cups/${cupId}/register`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.code === "API_REQUIRED") {
          router.push("/settings/api");
          return;
        }
        throw new Error(data.error || "参加登録に失敗しました");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleRegister}
        disabled={loading}
        className={cn(
          "w-full px-6 py-3 rounded-2xl font-semibold text-sm",
          "bg-primary text-primary-foreground",
          "hover:bg-accent transition-all",
          "active:scale-[0.98]",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {loading ? "処理中..." : "この大会に参加する"}
      </button>
      {error && (
        <p className="text-destructive text-xs mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
