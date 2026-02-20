import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar p-6 flex flex-col">
        <h1 className="text-lg font-bold mb-8">
          Trading Cup
          <span className="text-primary"> Admin</span>
        </h1>

        <nav className="flex-1 space-y-1">
          <a
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"
              />
            </svg>
            ダッシュボード
          </a>
          <span className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground text-sm cursor-not-allowed">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Cup管理（準備中）
          </span>
        </nav>

        <div className="border-t border-border pt-4 space-y-3">
          <div className="text-sm">
            <p className="font-medium">{session.user?.name}</p>
            <p className="text-muted-foreground text-xs">
              {session.user?.email}
            </p>
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">ダッシュボード</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-muted-foreground text-sm mb-1">開催中のCup</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-muted-foreground text-sm mb-1">登録ユーザー</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-muted-foreground text-sm mb-1">総参加者数</p>
              <p className="text-3xl font-bold">0</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">最近のアクティビティ</h3>
            <p className="text-muted-foreground text-sm">
              まだアクティビティはありません。Cupを作成して大会を開始しましょう。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
