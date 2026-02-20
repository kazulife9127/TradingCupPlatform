import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, CupStatus } from "@trading-cup/database";

const validTransitions: Record<string, string[]> = {
  DRAFT: ["UPCOMING"],
  UPCOMING: ["ACTIVE"],
  ACTIVE: ["FINISHED"],
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const newStatus = body.status as CupStatus;

  const cup = await prisma.cup.findUnique({ where: { id } });
  if (!cup) {
    return NextResponse.json(
      { error: "Cupが見つかりません" },
      { status: 404 }
    );
  }

  const allowed = validTransitions[cup.status];
  if (!allowed || !allowed.includes(newStatus)) {
    return NextResponse.json(
      {
        error: `${cup.status} から ${newStatus} への変更はできません`,
      },
      { status: 400 }
    );
  }

  const updated = await prisma.cup.update({
    where: { id },
    data: { status: newStatus },
  });

  return NextResponse.json(updated);
}
