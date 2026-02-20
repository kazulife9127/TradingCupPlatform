import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@trading-cup/database";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: cupId, participantId } = await params;
  const body = await request.json();
  const reason = body.reason as string;

  if (!reason || !["DISQUALIFIED_DEPOSIT", "DISQUALIFIED_VOLUME"].includes(reason)) {
    return NextResponse.json(
      { error: "失格理由を選択してください" },
      { status: 400 }
    );
  }

  const participant = await prisma.participant.findFirst({
    where: { id: participantId, cupId },
  });

  if (!participant) {
    return NextResponse.json(
      { error: "参加者が見つかりません" },
      { status: 404 }
    );
  }

  if (
    participant.status === "DISQUALIFIED_DEPOSIT" ||
    participant.status === "DISQUALIFIED_VOLUME"
  ) {
    return NextResponse.json(
      { error: "すでに失格処理済みです" },
      { status: 400 }
    );
  }

  const updated = await prisma.participant.update({
    where: { id: participantId },
    data: { status: reason as "DISQUALIFIED_DEPOSIT" | "DISQUALIFIED_VOLUME", rank: null },
  });

  return NextResponse.json(updated);
}
