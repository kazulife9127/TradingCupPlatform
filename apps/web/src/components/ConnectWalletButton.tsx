"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { connectMetaMask, signMessage, createSiweMessage } from "@/lib/ethereum";
import { cn } from "@/lib/utils";

export function ConnectWalletButton() {
  const [status, setStatus] = useState<
    "idle" | "connecting" | "signing" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setStatus("connecting");
      setError(null);

      const address = await connectMetaMask();

      const nonceRes = await fetch("/api/auth/nonce");
      const { nonce } = await nonceRes.json();

      setStatus("signing");
      const message = createSiweMessage(address, nonce);
      const signature = await signMessage(address, message);

      const result = await signIn("siwe", {
        message,
        signature,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Authentication failed");
      }

      window.location.href = "/lobby";
    } catch (err) {
      setStatus("error");
      if (err instanceof Error) {
        if (err.message.includes("not installed")) {
          setError("MetaMaskがインストールされていません");
        } else if (err.message.includes("User rejected")) {
          setError("署名がキャンセルされました");
        } else {
          setError(err.message);
        }
      }
    }
  };

  const isLoading = status === "connecting" || status === "signing";

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className={cn(
          "w-full max-w-sm px-6 py-4 rounded-2xl font-semibold text-lg",
          "bg-primary text-primary-foreground",
          "transition-all duration-200",
          "hover:bg-accent hover:scale-[1.02]",
          "active:scale-[0.98]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          "flex items-center justify-center gap-3"
        )}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {status === "connecting"
              ? "接続中..."
              : "署名を確認してください..."}
          </>
        ) : (
          <>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M21.17 6.17L12 1 2.83 6.17 12 11.34l9.17-5.17z"
                fill="currentColor"
                opacity="0.7"
              />
              <path
                d="M12 12.66L2.83 7.5V17.83L12 23l9.17-5.17V7.5L12 12.66z"
                fill="currentColor"
              />
            </svg>
            MetaMaskで接続
          </>
        )}
      </button>

      {error && (
        <p className="text-destructive text-sm text-center max-w-sm">
          {error}
        </p>
      )}
    </div>
  );
}
