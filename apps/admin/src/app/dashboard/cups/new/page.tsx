import Link from "next/link";
import { CreateCupForm } from "@/components/CreateCupForm";

export default function NewCupPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/dashboard/cups"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Cup一覧に戻る
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-2">テンプレートから新規作成</h2>
      <p className="text-muted-foreground text-sm mb-8">
        取引所・ペア・最低出来高はテンプレートの固定値が適用されます。
      </p>

      <CreateCupForm />
    </div>
  );
}
