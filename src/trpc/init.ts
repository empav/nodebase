import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  return { user: session?.user };
});

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<TRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: ctx.user.email,
    },
  });

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  const account = (await prisma.account.findMany()).filter(
    (acc) => acc.userId === ctx.user?.id,
  );

  if (!account) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  console.log(account);

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
