import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@trading-cup/database";
import { shortenAddress, cn } from "@/lib/utils";
import { formatDateFull, formatPnl, formatPnlPercent } from "@/lib/format";
import { Header } from "@/components/Header";
import { RegisterButton } from "@/components/RegisterButton";

const statusLabels: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "開催中", className: "bg-green-500/20 text-green-400" },
  UPCOMING: { label: "開催予定", className: "bg-blue-500/20 text-blue-400" },
  FINISHED: { label: "終了", className: "bg-muted text-muted-foreground" },
};

const disqualifyReasons: Record<string, string> = {
  DISQUALIFIED_DEPOSIT: "大会期間中に入出金が検知されたため、失格となりました。",
  DISQUALIFIED_VOLUME: "最低出来高条件を満たさなかったため、ランキング対象外です。",
};

export default async function CupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.name) {
    return notFound();
  }

  const address = session.user.name;
  const userId = session.user.id;

  const cup = await prisma.cup.findUnique({
    where: { id },
    include: {
      participants: {
        include: { user: true },
        orderBy: { rank: "asc" },
      },
    },
  });

  if (!cup || cup.status === "DRAFT") notFound();

  const statusInfo = statusLabels[cup.status] ?? statusLabels.FINISHED;

  const myParticipation = cup.participants.find(
    (p) => p.user.walletAddress.toLowerCase() === address.toLowerCase()
  );

  const isDisqualified =
    myParticipation?.status === "DISQUALIFIED_DEPOSIT" ||
    myParticipation?.status === "DISQUALIFIED_VOLUME";

  const canRegister =
    !myParticipation &&
    (cup.status === "UPCOMING" || cup.status === "ACTIVE");

  const activeParticipants = cup.participants.filter(
    (p) =>
      p.status === "ACTIVE" || p.status === "REGISTERED"
  );

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

        <div className="flex items-start justify-between mb-6">
          <h2 className="text-xl font-bold">{cup.title}</h2>
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0",
              statusInfo.className
            )}
          >
            {statusInfo.label}
          </span>
        </div>

        {cup.description && (
          <p className="text-muted-foreground text-sm mb-6">
            {cup.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-muted-foreground text-xs mb-0.5">取引所</p>
            <p className="font-medium text-sm">{cup.exchange}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-muted-foreground text-xs mb-0.5">ペア</p>
            <p className="font-medium text-sm">{cup.pair}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-muted-foreground text-xs mb-0.5">開始</p>
            <p className="font-medium text-sm">{formatDateFull(cup.startAt)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-muted-foreground text-xs mb-0.5">終了</p>
            <p className="font-medium text-sm">{formatDateFull(cup.endAt)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-muted-foreground text-xs mb-0.5">最低出来高</p>
            <p className="font-medium text-sm">{cup.minVolume} USDT</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-muted-foreground text-xs mb-0.5">参加者数</p>
            <p className="font-medium text-sm">{cup.participants.length}名</p>
          </div>
        </div>

        {/* Disqualified notice */}
        {isDisqualified && myParticipation && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 mb-6">
            <p className="text-destructive font-semibold text-sm mb-1">失格</p>
            <p className="text-sm text-destructive/80">
              {disqualifyReasons[myParticipation.status]}
            </p>
          </div>
        )}

        {/* Register button */}
        {canRegister && (
          <div className="mb-6">
            <RegisterButton cupId={cup.id} />
          </div>
        )}

        {/* My participation stats */}
        {myParticipation && !isDisqualified && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-6">
            <p className="text-xs text-primary font-medium mb-2">
              あなたの成績
            </p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold">
                  #{myParticipation.rank ?? "-"}
                </span>
                <span className="text-muted-foreground text-sm ml-1">位</span>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "font-semibold",
                    (myParticipation.pnlPercent ?? 0) >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  )}
                >
                  {myParticipation.pnlPercent != null
                    ? formatPnlPercent(myParticipation.pnlPercent)
                    : "-"}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNL:{" "}
                  {myParticipation.pnl != null
                    ? formatPnl(myParticipation.pnl)
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rankings */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-sm">ランキング</h3>
          </div>
          {activeParticipants.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              参加者はまだいません
            </div>
          ) : (
            <div className="divide-y divide-border">
              {activeParticipants.map((p) => {
                const isMe =
                  p.user.walletAddress.toLowerCase() === address.toLowerCase();
                return (
                  <div
                    key={p.id}
                    className={cn(
                      "flex items-center px-4 py-3 gap-3",
                      isMe && "bg-primary/5"
                    )}
                  >
                    <span className="w-8 text-center font-bold text-sm">
                      {p.rank ?? "-"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs truncate">
                        {shortenAddress(p.user.walletAddress)}
                        {isMe && (
                          <span className="text-primary ml-1 font-sans">
                            (自分)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        出来高: {p.volume?.toLocaleString() ?? "-"} USDT
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={cn(
                          "font-semibold text-sm",
                          (p.pnlPercent ?? 0) >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        )}
                      >
                        {p.pnlPercent != null
                          ? formatPnlPercent(p.pnlPercent)
                          : "-"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.pnl != null ? formatPnl(p.pnl) : "-"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
