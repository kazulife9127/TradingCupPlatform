import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@trading-cup/database";
import { CupStatusBadge } from "@/components/CupStatusBadge";
import { CupStatusActions } from "@/components/CupStatusActions";
import { FinalizeButton } from "@/components/FinalizeButton";
import { DisqualifyButton } from "@/components/DisqualifyButton";
import { formatDate } from "@/lib/format";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default async function CupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cup = await prisma.cup.findUnique({
    where: { id },
    include: {
      participants: {
        include: { user: true },
        orderBy: { rank: "asc" },
      },
    },
  });

  if (!cup) notFound();

  const isFinalized = !!cup.finalizedAt;
  const canFinalize = cup.status === "FINISHED" && !isFinalized;

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <Link
          href="/dashboard/cups"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Cup一覧に戻る
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold">{cup.title}</h2>
            <CupStatusBadge status={cup.status} />
            {isFinalized && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                確定済み
              </span>
            )}
          </div>
          {cup.description && (
            <p className="text-muted-foreground text-sm">{cup.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          {canFinalize && <FinalizeButton cupId={cup.id} />}
          {!isFinalized && (
            <CupStatusActions cupId={cup.id} status={cup.status} />
          )}
        </div>
      </div>

      {/* Cup info grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-muted-foreground text-xs mb-1">取引所</p>
          <p className="font-medium text-sm">{cup.exchange}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-muted-foreground text-xs mb-1">ペア</p>
          <p className="font-medium text-sm">{cup.pair}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-muted-foreground text-xs mb-1">開始日時</p>
          <p className="font-medium text-sm">{formatDate(cup.startAt)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-muted-foreground text-xs mb-1">終了日時</p>
          <p className="font-medium text-sm">{formatDate(cup.endAt)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-muted-foreground text-xs mb-1">最低出来高</p>
          <p className="font-medium text-sm">{cup.minVolume} USDT</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-muted-foreground text-xs mb-1">参加者数</p>
          <p className="font-medium text-sm">{cup.participants.length}名</p>
        </div>
        {cup.finalizedAt && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
            <p className="text-green-700 text-xs mb-1">結果確定日時</p>
            <p className="font-medium text-sm text-green-800">
              {formatDate(cup.finalizedAt)}
            </p>
          </div>
        )}
      </div>

      {/* Participants table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/50">
          <h3 className="font-semibold text-sm">参加者ランキング</h3>
        </div>
        {cup.participants.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            参加者はまだいません
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-center px-4 py-2 font-medium w-16">
                  順位
                </th>
                <th className="text-left px-4 py-2 font-medium">ユーザー</th>
                <th className="text-right px-4 py-2 font-medium">PNL%</th>
                <th className="text-right px-4 py-2 font-medium">PNL</th>
                <th className="text-right px-4 py-2 font-medium">出来高</th>
                <th className="text-left px-4 py-2 font-medium">ステータス</th>
                {!isFinalized && (
                  <th className="text-right px-4 py-2 font-medium w-20">
                    操作
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {cup.participants.map((p) => {
                const isDQ =
                  p.status === "DISQUALIFIED_DEPOSIT" ||
                  p.status === "DISQUALIFIED_VOLUME";
                return (
                  <tr
                    key={p.id}
                    className={`border-b border-border last:border-0 hover:bg-muted/30 ${isDQ ? "opacity-50" : ""}`}
                  >
                    <td className="text-center px-4 py-2.5 font-bold">
                      {isDQ ? "-" : (p.rank ?? "-")}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs">
                      {shortenAddress(p.user.walletAddress)}
                    </td>
                    <td
                      className={`text-right px-4 py-2.5 font-medium ${
                        (p.pnlPercent ?? 0) >= 0
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {p.pnlPercent != null
                        ? `${p.pnlPercent >= 0 ? "+" : ""}${p.pnlPercent.toFixed(1)}%`
                        : "-"}
                    </td>
                    <td
                      className={`text-right px-4 py-2.5 ${
                        (p.pnl ?? 0) >= 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {p.pnl != null
                        ? `${p.pnl >= 0 ? "+" : ""}${p.pnl.toFixed(2)}`
                        : "-"}
                    </td>
                    <td className="text-right px-4 py-2.5">
                      {p.volume != null ? p.volume.toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                      {p.status === "ACTIVE"
                        ? "有効"
                        : p.status === "DISQUALIFIED_DEPOSIT"
                          ? "失格(入出金)"
                          : p.status === "DISQUALIFIED_VOLUME"
                            ? "出来高未達"
                            : "登録済"}
                    </td>
                    {!isFinalized && (
                      <td className="text-right px-4 py-2.5">
                        {!isDQ && (
                          <DisqualifyButton
                            cupId={cup.id}
                            participantId={p.id}
                            walletAddress={p.user.walletAddress}
                          />
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
