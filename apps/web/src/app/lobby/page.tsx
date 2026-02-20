import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@trading-cup/database";
import { Header } from "@/components/Header";
import { CupCard } from "@/components/CupCard";

export default async function LobbyPage() {
  const session = await auth();
  if (!session?.user?.name) redirect("/");

  const address = session.user.name;

  const cups = await prisma.cup.findMany({
    where: { status: { in: ["ACTIVE", "UPCOMING", "FINISHED"] } },
    orderBy: { startAt: "desc" },
    include: {
      _count: { select: { participants: true } },
    },
  });

  const activeCups = cups.filter((c) => c.status === "ACTIVE");
  const upcomingCups = cups.filter((c) => c.status === "UPCOMING");
  const finishedCups = cups.filter((c) => c.status === "FINISHED");

  const sections = [
    { title: "開催中", cups: activeCups, emptyText: "現在開催中の大会はありません" },
    { title: "開催予定", cups: upcomingCups, emptyText: null },
    { title: "終了済み", cups: finishedCups, emptyText: null },
  ];

  const hasAnyCups = cups.length > 0;

  return (
    <div className="flex min-h-dvh flex-col">
      <Header address={address} />

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        {!hasAnyCups ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center mt-20">
            <div className="rounded-3xl border border-border bg-card p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">ロビー</h2>
              <p className="text-muted-foreground text-sm">
                現在表示できる大会はありません。
                <br />
                大会が公開されるとここに表示されます。
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {sections.map(
              (section) =>
                (section.cups.length > 0 || section.emptyText) && (
                  <div key={section.title}>
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {section.title}
                    </h2>
                    {section.cups.length > 0 ? (
                      <div className="space-y-3">
                        {section.cups.map((cup) => (
                          <CupCard
                            key={cup.id}
                            id={cup.id}
                            title={cup.title}
                            status={cup.status}
                            pair={cup.pair}
                            startAt={cup.startAt}
                            endAt={cup.endAt}
                            participantCount={cup._count.participants}
                          />
                        ))}
                      </div>
                    ) : section.emptyText ? (
                      <p className="text-muted-foreground text-sm rounded-2xl border border-border bg-card p-5">
                        {section.emptyText}
                      </p>
                    ) : null}
                  </div>
                )
            )}
          </div>
        )}
      </main>
    </div>
  );
}
