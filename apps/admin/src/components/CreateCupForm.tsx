"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function CreateCupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const defaultStart = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000);
  const defaultEnd = new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000);

  const toLocalDatetime = (d: Date) => {
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 16);
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(
    "IZKY/USDT 現物取引で収益率を競うトレーディング大会です。"
  );
  const [startAt, setStartAt] = useState(toLocalDatetime(defaultStart));
  const [endAt, setEndAt] = useState(toLocalDatetime(defaultEnd));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          startAt: new Date(startAt).toISOString(),
          endAt: new Date(endAt).toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "作成に失敗しました");
      }

      const cup = await res.json();
      router.push(`/dashboard/cups/${cup.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          大会タイトル
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="IZKY Trading Cup #4"
          className={cn(
            "w-full px-4 py-2.5 rounded-xl border border-border bg-background",
            "text-sm placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          )}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          説明
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl border border-border bg-background",
            "text-sm placeholder:text-muted-foreground resize-none",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          )}
        />
      </div>

      {/* Template fields (read-only) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            取引所
          </label>
          <input
            type="text"
            value="Exchange A"
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            ペア
          </label>
          <input
            type="text"
            value="IZKY/USDT"
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            最低出来高
          </label>
          <input
            type="text"
            value="100 USDT"
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="startAt" className="text-sm font-medium">
            開始日時
          </label>
          <input
            id="startAt"
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            required
            className={cn(
              "w-full px-4 py-2.5 rounded-xl border border-border bg-background",
              "text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            )}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="endAt" className="text-sm font-medium">
            終了日時
          </label>
          <input
            id="endAt"
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            required
            className={cn(
              "w-full px-4 py-2.5 rounded-xl border border-border bg-background",
              "text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            )}
          />
        </div>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "px-6 py-2.5 rounded-xl font-medium text-sm",
            "bg-primary text-primary-foreground hover:bg-accent transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {loading ? "作成中..." : "下書きとして作成"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl font-medium text-sm border border-border hover:bg-muted transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
