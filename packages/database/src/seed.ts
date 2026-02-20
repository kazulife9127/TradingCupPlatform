import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin user ---
  const password = await hash("admin123", 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@tradingcup.io" },
    update: {},
    create: {
      email: "admin@tradingcup.io",
      password,
      name: "Admin",
    },
  });
  console.log("Seeded admin user:", admin.email);

  // --- Sample users (for participant data) ---
  const wallets = [
    "0x1234567890abcdef1234567890abcdef12345678",
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    "0x9876543210fedcba9876543210fedcba98765432",
    "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
    "0xcafebabecafebabecafebabecafebabecafebabe",
  ];

  const users = await Promise.all(
    wallets.map((w) =>
      prisma.user.upsert({
        where: { walletAddress: w },
        update: {},
        create: { walletAddress: w },
      })
    )
  );
  console.log(`Seeded ${users.length} sample users`);

  // --- Cup #1: FINISHED (ended today, started 7 days ago) ---
  const now = new Date();
  const cup1Start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const cup1End = new Date(now.getTime() - 1 * 60 * 60 * 1000);

  const cup1 = await prisma.cup.upsert({
    where: { id: "cup-seed-finished-01" },
    update: {},
    create: {
      id: "cup-seed-finished-01",
      title: "IZKY Trading Cup #1",
      description:
        "記念すべき第1回 IZKY トレーディング大会。IZKY/USDT 現物取引で収益率を競います。",
      status: "FINISHED",
      exchange: "Exchange A",
      pair: "IZKY/USDT",
      startAt: cup1Start,
      endAt: cup1End,
      minVolume: 100,
    },
  });

  const cup1Participants = [
    {
      userId: users[0].id,
      startBalance: 1000,
      endBalance: 1350,
      pnl: 350,
      pnlPercent: 35.0,
      volume: 4200,
      rank: 1,
      status: "ACTIVE" as const,
    },
    {
      userId: users[1].id,
      startBalance: 2500,
      endBalance: 3050,
      pnl: 550,
      pnlPercent: 22.0,
      volume: 8100,
      rank: 2,
      status: "ACTIVE" as const,
    },
    {
      userId: users[2].id,
      startBalance: 500,
      endBalance: 555,
      pnl: 55,
      pnlPercent: 11.0,
      volume: 1500,
      rank: 3,
      status: "ACTIVE" as const,
    },
    {
      userId: users[3].id,
      startBalance: 800,
      endBalance: 760,
      pnl: -40,
      pnlPercent: -5.0,
      volume: 3200,
      rank: 4,
      status: "ACTIVE" as const,
    },
    {
      userId: users[4].id,
      startBalance: 1200,
      endBalance: 1080,
      pnl: -120,
      pnlPercent: -10.0,
      volume: 600,
      rank: 5,
      status: "ACTIVE" as const,
    },
  ];

  for (const p of cup1Participants) {
    await prisma.participant.upsert({
      where: { cupId_userId: { cupId: cup1.id, userId: p.userId } },
      update: {},
      create: {
        cupId: cup1.id,
        ...p,
      },
    });
  }
  console.log(
    `Seeded Cup #1 (FINISHED) with ${cup1Participants.length} participants`
  );

  // --- Cup #2: ACTIVE (started 3 days ago, ends in 4 days) ---
  const cup2Start = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const cup2End = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);

  const cup2 = await prisma.cup.upsert({
    where: { id: "cup-seed-active-01" },
    update: {},
    create: {
      id: "cup-seed-active-01",
      title: "IZKY Trading Cup #2",
      description:
        "第2回 IZKY トレーディング大会。開催中！参加者募集は締め切りました。",
      status: "ACTIVE",
      exchange: "Exchange A",
      pair: "IZKY/USDT",
      startAt: cup2Start,
      endAt: cup2End,
      minVolume: 100,
    },
  });

  const cup2Participants = [
    {
      userId: users[0].id,
      startBalance: 1500,
      endBalance: 1680,
      pnl: 180,
      pnlPercent: 12.0,
      volume: 2800,
      rank: 1,
      status: "ACTIVE" as const,
    },
    {
      userId: users[2].id,
      startBalance: 800,
      endBalance: 856,
      pnl: 56,
      pnlPercent: 7.0,
      volume: 1100,
      rank: 2,
      status: "ACTIVE" as const,
    },
    {
      userId: users[4].id,
      startBalance: 2000,
      endBalance: 1940,
      pnl: -60,
      pnlPercent: -3.0,
      volume: 3500,
      rank: 3,
      status: "ACTIVE" as const,
    },
  ];

  for (const p of cup2Participants) {
    await prisma.participant.upsert({
      where: { cupId_userId: { cupId: cup2.id, userId: p.userId } },
      update: {},
      create: {
        cupId: cup2.id,
        ...p,
      },
    });
  }
  console.log(
    `Seeded Cup #2 (ACTIVE) with ${cup2Participants.length} participants`
  );

  // --- Cup #3: DRAFT (template) ---
  await prisma.cup.upsert({
    where: { id: "cup-seed-draft-01" },
    update: {},
    create: {
      id: "cup-seed-draft-01",
      title: "IZKY Trading Cup #3",
      description: "第3回 IZKY トレーディング大会（テンプレート）",
      status: "DRAFT",
      exchange: "Exchange A",
      pair: "IZKY/USDT",
      startAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      endAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      minVolume: 100,
    },
  });
  console.log("Seeded Cup #3 (DRAFT)");

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
