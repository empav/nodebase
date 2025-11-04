import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { generateSlug } from "random-word-slugs";
import z from "zod";

export const workflowsRouter = createTRPCRouter({
  createOne: premiumProcedure.mutation(async ({ ctx }) => {
    return prisma.workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.user.id,
      },
    });
  }),
  removeOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await prisma.workflow.delete({
        where: { userId: ctx.user.id, id: input.id },
      });
      return { success: true, message: "Workflow deleted" };
    }),
  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(3) }))
    .mutation(async ({ ctx, input }) => {
      await prisma.workflow.update({
        where: { userId: ctx.user.id, id: input.id },
        data: { name: input.name },
      });
      return { success: true, message: "Workflow renamed" };
    }),
  findOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return prisma.workflow.findFirst({
        where: { userId: ctx.user.id, id: input.id },
      });
    }),
  findMany: protectedProcedure.query(({ ctx }) =>
    prisma.workflow.findMany({
      where: {
        userId: ctx.user.id,
      },
    }),
  ),
  testAI: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/execute.ai",
      data: {},
    });
    return { success: true, message: "AI triggered" };
  }),
});

export type WorkflowsRouter = typeof workflowsRouter;
