import { type Prisma, PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    id: "1",
    name: "Emanuele Pavan",
    email: "emanuele.pav@gmail.com",
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();
