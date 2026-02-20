import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@trading-cup/database";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: cupId } = await params;
  const userId = session.user.id;

  const cup = await prisma.cup.findUnique({ where: { id: cupId } });
  if (!cup) {
    return NextResponse.json({ error: "Cupが見つかりません" }, { status: 404 });
  }

  if (cup.status !== "UPCOMING" && cup.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "このCupには参加できません" },
      { status: 400 }
    );
  }

  const existing = await prisma.participant.findUnique({
    where: { cupId_userId: { cupId, userId } },
  });

  if (existing) {
    return NextResponse.json(
      { error: "すでに参加登録済みです" },
      { status: 400 }
    );
  }

  const hasApiKey = await prisma.apiKey.findFirst({
    where: { userId, exchange: cup.exchange, isValid: true },
  });

  if (!hasApiKey) {
    return NextResponse.json(
      { error: "参加するにはAPI設定が必要です", code: "API_REQUIRED" },
      { status: 400 }
    );
  }

  const participant = await prisma.participant.create({
    data: {
      cupId,
      userId,
      status: "REGISTERED",
    },
  });

  return NextResponse.json(participant, { status: 201 });
}
