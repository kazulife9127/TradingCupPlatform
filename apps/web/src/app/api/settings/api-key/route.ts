import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, encrypt } from "@trading-cup/database";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = await prisma.apiKey.findFirst({
    where: { userId: session.user.id },
    select: {
      id: true,
      exchange: true,
      isValid: true,
      lastTestedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ apiKey });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { apiKey, apiSecret, exchange } = body;

  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "API KeyとAPI Secretは必須です" },
      { status: 400 }
    );
  }

  const exchangeName = exchange || "Exchange A";
  const encryptedKey = encrypt(apiKey);
  const encryptedSecret = encrypt(apiSecret);

  const saved = await prisma.apiKey.upsert({
    where: {
      userId_exchange: {
        userId: session.user.id,
        exchange: exchangeName,
      },
    },
    update: {
      apiKey: encryptedKey,
      apiSecret: encryptedSecret,
      isValid: false,
      lastTestedAt: null,
    },
    create: {
      userId: session.user.id,
      exchange: exchangeName,
      apiKey: encryptedKey,
      apiSecret: encryptedSecret,
      isValid: false,
    },
  });

  return NextResponse.json({
    id: saved.id,
    exchange: saved.exchange,
    isValid: saved.isValid,
  });
}
