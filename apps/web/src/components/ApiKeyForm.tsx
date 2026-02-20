"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ApiKeyData {
  id: string;
  exchange: string;
  isValid: boolean;
  lastTestedAt: string | null;
}

export function ApiKeyForm() {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [existing, setExisting] = useState<ApiKeyData | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/settings/api-key")
      .then((r) => r.json())
      .then((data) => {
        if (data.apiKey) setExisting(data.apiKey);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings/api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          apiSecret,
          exchange: "Exchange A",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      const data = await res.json();
      setExisting(data);
      setApiKey("");
      setApiSecret("");
      setMessage({ type: "success", text: "APIキーを保存しました" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "保存に失敗しました",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings/api-key/test", {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setExisting((prev) =>
          prev
            ? { ...prev, isValid: true, lastTestedAt: new Date().toISOString() }
            : prev
        );
      } else {
        setMessage({ type: "error", text: data.message || data.error });
      }
    } catch {
      setMessage({ type: "error", text: "テストに失敗しました" });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current status */}
      {existing && (
        <div
          className={cn(
            "rounded-xl border p-4",
            existing.isValid
              ? "border-green-500/30 bg-green-500/10"
              : "border-yellow-500/30 bg-yellow-500/10"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{existing.exchange}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {existing.isValid ? "接続確認済み" : "未テスト"}
                {existing.lastTestedAt &&
                  ` (${new Intl.DateTimeFormat("ja-JP", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(existing.lastTestedAt))})`}
              </p>
            </div>
            <button
              onClick={handleTest}
              disabled={testing}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                "border border-border hover:bg-muted",
                "disabled:opacity-50"
              )}
            >
              {testing ? "テスト中..." : "接続テスト"}
            </button>
          </div>
        </div>
      )}

      {/* Registration form */}
      <form onSubmit={handleSave} className="space-y-4">
        <p className="text-xs text-muted-foreground">
          {existing
            ? "新しいAPIキーで上書きできます。Read-only権限のAPIキーのみ使用してください。"
            : "取引所のRead-only APIキーを登録してください。"}
        </p>

        <div className="space-y-2">
          <label htmlFor="apiKey" className="text-sm font-medium">
            API Key
          </label>
          <input
            id="apiKey"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            placeholder="your-api-key"
            className={cn(
              "w-full px-4 py-2.5 rounded-xl border border-border bg-card",
              "text-sm font-mono placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            )}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="apiSecret" className="text-sm font-medium">
            API Secret
          </label>
          <input
            id="apiSecret"
            type="password"
            value={apiSecret}
            onChange={(e) => setApiSecret(e.target.value)}
            required
            placeholder="your-api-secret"
            className={cn(
              "w-full px-4 py-2.5 rounded-xl border border-border bg-card",
              "text-sm font-mono placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            )}
          />
        </div>

        {message && (
          <p
            className={cn(
              "text-sm",
              message.type === "success" ? "text-green-400" : "text-destructive"
            )}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl font-medium text-sm",
            "bg-primary text-primary-foreground hover:bg-accent transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {saving ? "保存中..." : "APIキーを保存"}
        </button>
      </form>
    </div>
  );
}
