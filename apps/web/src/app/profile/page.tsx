import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@trading-cup/database";
import { shortenAddress, cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { formatPnlPercent } from "@/lib/format";

function getBadge(rank: number | null): { label: string; className: string } | null {
  if (rank === 1) return { label: "1st", className: "bg-yellow-500/20 text-yellow-400" };
  if (rank === 2) return { label: "2nd", className: "bg-gray-300/20 text-gray-300" };
  if (rank === 3) return { label: "3rd", className: "bg-orange-500/20 text-orange-400" };
  return null;
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.name || !session?.user?.id) redirect("/");

  const address = session.user.name;
  const userId = session.user.id;

  const participations = await prisma.participant.findMany({
    where: { userId },
    include: {
      cup: {
        select: {
          id: true,
          title: true,
          status: true,
          startAt: true,
          endAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const finishedResults = participations.filter(
    (p) => p.cup.status === "FINISHED"
  );
  const activeParticipations = participations.filter(
    (p) => p.cup.status === "ACTIVE" || p.cup.status === "UPCOMING"
  );

  const badges = finishedResults
    .map((p) => getBadge(p.rank))
    .filter((b): b is NonNullable<typeof b> => b !== null);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header address={address} />

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <Link
          href="/lobby"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block"
        >
          &larr; ロビーに戻る
        </Link>

        {/* User info */}
        <div className="rounded-2xl border border-border bg-card p-5 mb-6">
          <p className="font-mono text-sm mb-1">{shortenAddress(address)}</p>
          <p className="text-xs text-muted-foreground">{address}</p>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              獲得バッジ
            </h3>
            <div className="flex gap-2 flex-wrap">
              {badges.map((badge, i) => (
                <span
                  key={i}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-bold",
                    badge.className
                  )}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Active participations */}
        {activeParticipations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              参加中の大会
            </h3>
            <div className="space-y-2">
              {activeParticipations.map((p) => (
                <Link
                  key={p.id}
                  href={`/cup/${p.cup.id}`}
                  className="block rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{p.cup.title}</p>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                      {p.cup.status === "ACTIVE" ? "開催中" : "開催予定"}
                    </span>
                  </div>
                  {p.pnlPercent != null && (
                    <p
                      className={cn(
                        "text-sm font-semibold mt-1",
                        p.pnlPercent >= 0 ? "text-green-400" : "text-red-400"
                      )}
                    >
                      {formatPnlPercent(p.pnlPercent)} (#{p.rank ?? "-"})
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Past results */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            過去の大会結果
          </h3>
          {finishedResults.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground text-sm">
                まだ完了した大会はありません。
                <br />
                大会に参加して実績を積みましょう。
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {finishedResults.map((p) => {
                const badge = getBadge(p.rank);
                return (
                  <Link
                    key={p.id}
                    href={`/cup/${p.cup.id}`}
                    className="block rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{p.cup.title}</p>
                      {badge && (
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-bold",
                            badge.className
                          )}
                        >
                          {badge.label}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>#{p.rank ?? "-"}位</span>
                      {p.pnlPercent != null && (
                        <span
                          className={cn(
                            "font-medium",
                            p.pnlPercent >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          )}
                        >
                          {formatPnlPercent(p.pnlPercent)}
                        </span>
                      )}
                      <span>
                        出来高: {p.volume?.toLocaleString() ?? "-"} USDT
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
