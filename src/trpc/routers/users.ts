import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import prisma from "@/lib/prisma";

export const usersRouter = createTRPCRouter({
  findMany: baseProcedure.query(() => prisma.user.findMany()),
});

export type UsersRouter = typeof usersRouter;
