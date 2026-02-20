import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@trading-cup/database";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const cup = await prisma.cup.findUnique({ where: { id } });
  if (!cup) {
    return NextResponse.json({ error: "Cupが見つかりません" }, { status: 404 });
  }

  if (cup.status !== "FINISHED") {
    return NextResponse.json(
      { error: "終了したCupのみ結果を確定できます" },
      { status: 400 }
    );
  }

  if (cup.finalizedAt) {
    return NextResponse.json(
      { error: "すでに結果は確定済みです" },
      { status: 400 }
    );
  }

  const updated = await prisma.cup.update({
    where: { id },
    data: { finalizedAt: new Date() },
  });

  return NextResponse.json(updated);
}
