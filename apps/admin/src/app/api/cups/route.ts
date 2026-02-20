import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@trading-cup/database";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, startAt, endAt } = body;

  if (!title || !startAt || !endAt) {
    return NextResponse.json(
      { error: "タイトル・開始日時・終了日時は必須です" },
      { status: 400 }
    );
  }

  const cup = await prisma.cup.create({
    data: {
      title,
      description: description || null,
      status: "DRAFT",
      exchange: "Exchange A",
      pair: "IZKY/USDT",
      minVolume: 100,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
    },
  });

  return NextResponse.json(cup, { status: 201 });
}
