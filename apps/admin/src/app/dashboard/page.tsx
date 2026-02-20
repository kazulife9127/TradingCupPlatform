import { prisma } from "@trading-cup/database";

export default async function DashboardPage() {
  const [activeCups, userCount, participantCount] = await Promise.all([
    prisma.cup.count({ where: { status: "ACTIVE" } }),
    prisma.user.count(),
    prisma.participant.count(),
  ]);

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">ダッシュボード</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-muted-foreground text-sm mb-1">開催中のCup</p>
          <p className="text-3xl font-bold">{activeCups}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-muted-foreground text-sm mb-1">登録ユーザー</p>
          <p className="text-3xl font-bold">{userCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-muted-foreground text-sm mb-1">総参加者数</p>
          <p className="text-3xl font-bold">{participantCount}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-4">最近のアクティビティ</h3>
        <p className="text-muted-foreground text-sm">
          まだアクティビティはありません。Cupを作成して大会を開始しましょう。
        </p>
      </div>
    </div>
  );
}
