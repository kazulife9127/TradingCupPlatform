import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/lobby");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Trading
            <span className="text-primary"> Cup</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            IZKYトレーディング大会プラットフォーム
          </p>
        </div>

        <div className="w-full rounded-3xl border border-border bg-card p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold">ウォレット接続</h2>
            <p className="text-muted-foreground text-xs">
              MetaMaskウォレットで署名してログイン
            </p>
          </div>
          <ConnectWalletButton />
        </div>

        <p className="text-muted-foreground text-xs text-center">
          接続することで利用規約に同意したものとみなされます
        </p>
      </div>
    </main>
  );
}
