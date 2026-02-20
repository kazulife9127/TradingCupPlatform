import Link from "next/link";
import { shortenAddress } from "@/lib/utils";
import { SignOutButton } from "./SignOutButton";

export function Header({ address }: { address: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <Link href="/lobby" className="text-lg font-bold">
          Trading<span className="text-primary"> Cup</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/profile"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted"
          >
            プロフィール
          </Link>
          <Link
            href="/settings/api"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted"
          >
            API設定
          </Link>
          <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded-lg ml-1">
            {shortenAddress(address)}
          </span>
          <SignOutButton />
        </nav>
      </div>
    </header>
  );
}
