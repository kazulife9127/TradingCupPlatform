import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { shortenAddress } from "@/lib/utils";
import { SignOutButton } from "@/components/SignOutButton";

export default async function LobbyPage() {
  const session = await auth();
  if (!session?.user?.name) redirect("/");

  const address = session.user.name;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <h1 className="text-lg font-bold">
            Trading<span className="text-primary"> Cup</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded-lg">
              {shortenAddress(address)}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-lg space-y-6 text-center">
          <div className="rounded-3xl border border-border bg-card p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold">ロビー</h2>
            <p className="text-muted-foreground text-sm">
              現在開催中の大会はありません。
              <br />
              大会が公開されるとここに表示されます。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
