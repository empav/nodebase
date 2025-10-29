import { Prisma, PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Emanuele Pavan",
    email: "asd@asd.com",
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();
