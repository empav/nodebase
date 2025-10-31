import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/prisma";

export const usersRouter = createTRPCRouter({
  findMany: protectedProcedure.query(() => prisma.user.findMany()),
});

export type UsersRouter = typeof usersRouter;
