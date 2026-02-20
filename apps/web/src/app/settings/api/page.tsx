import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Header } from "@/components/Header";
import { ApiKeyForm } from "@/components/ApiKeyForm";

export default async function ApiSettingsPage() {
  const session = await auth();
  if (!session?.user?.name) redirect("/");

  return (
    <div className="flex min-h-dvh flex-col">
      <Header address={session.user.name} />

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <Link
          href="/lobby"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block"
        >
          &larr; ロビーに戻る
        </Link>

        <h2 className="text-xl font-bold mb-2">API設定</h2>
        <p className="text-muted-foreground text-sm mb-6">
          大会に参加するには取引所のRead-only APIキーの登録が必要です。
        </p>

        <div className="rounded-2xl border border-border bg-card p-5">
          <ApiKeyForm />
        </div>

        <div className="mt-6 rounded-xl bg-muted p-4">
          <p className="text-xs text-muted-foreground font-medium mb-2">
            APIキーについて
          </p>
          <ul className="text-xs text-muted-foreground space-y-1.5">
            <li>- Read-only（読み取り専用）権限のキーのみ使用してください</li>
            <li>- 取引・出金権限のあるキーは絶対に登録しないでください</li>
            <li>- APIキーは暗号化して保存されます</li>
            <li>- 残高・取引履歴の取得にのみ使用します</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
