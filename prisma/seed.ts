import { PrismaClient, Role, Status } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const sellerPassword = await bcrypt.hash("seller123", 10);

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@gbath.com" },
    update: {},
    create: {
      name: "Grace Tama",
      email: "admin@gbath.com",
      passwordHash: adminPassword,
      phone: "021 555 9999",
      role: Role.ADMIN,
      status: Status.ACTIVE,
    },
  });

  // Salesperson user
  const seller = await prisma.user.upsert({
    where: { email: "alex@gbath.com" },
    update: {},
    create: {
      name: "Alex Rivera",
      email: "alex@gbath.com",
      passwordHash: sellerPassword,
      phone: "021 555 1001",
      role: Role.SELLER,
      status: Status.ACTIVE,
    },
  });

  console.log("Database seeded successfully:", { admin: admin.email, seller: seller.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
