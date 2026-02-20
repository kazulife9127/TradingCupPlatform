import Link from "next/link";
import { prisma } from "@trading-cup/database";
import { CupStatusBadge } from "@/components/CupStatusBadge";
import { formatDate } from "@/lib/format";

export default async function CupsPage() {
  const cups = await prisma.cup.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { participants: true } },
    },
  });

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Cup管理</h2>
        <Link
          href="/dashboard/cups/new"
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-accent transition-colors"
        >
          テンプレートから作成
        </Link>
      </div>

      {cups.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            まだCupがありません。テンプレートから最初のCupを作成しましょう。
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium">タイトル</th>
                <th className="text-left px-4 py-3 font-medium">ステータス</th>
                <th className="text-left px-4 py-3 font-medium">期間</th>
                <th className="text-right px-4 py-3 font-medium">参加者</th>
                <th className="text-right px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {cups.map((cup) => (
                <tr
                  key={cup.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{cup.title}</td>
                  <td className="px-4 py-3">
                    <CupStatusBadge status={cup.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(cup.startAt)} ~ {formatDate(cup.endAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {cup._count.participants}名
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/cups/${cup.id}`}
                      className="text-primary hover:text-accent text-sm font-medium transition-colors"
                    >
                      詳細
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
