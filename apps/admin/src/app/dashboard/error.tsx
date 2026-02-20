"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">ダッシュボード</h2>
      <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-8 text-center space-y-4">
        <p className="text-destructive font-semibold">
          ページの読み込み中にエラーが発生しました
        </p>
        <p className="text-muted-foreground text-sm">
          データベース接続や環境変数の設定を確認してください。
          {error.digest && (
            <span className="block mt-1 font-mono text-xs">
              Digest: {error.digest}
            </span>
          )}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-accent transition-colors"
        >
          再読み込み
        </button>
      </div>
    </div>
  );
}
