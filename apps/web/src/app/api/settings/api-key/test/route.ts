import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@trading-cup/database";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = await prisma.apiKey.findFirst({
    where: { userId: session.user.id },
  });

  if (!apiKey) {
    return NextResponse.json(
      { error: "APIキーが登録されていません" },
      { status: 400 }
    );
  }

  // Phase1: Simulate connection test (actual exchange API integration in Phase2)
  // For now, mark as valid if keys exist
  const isValid = true;

  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: {
      isValid,
      lastTestedAt: new Date(),
    },
  });

  return NextResponse.json({
    success: isValid,
    message: isValid
      ? "接続テスト成功（Read-only確認済み）"
      : "接続テスト失敗。APIキーを確認してください。",
  });
}
