import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
