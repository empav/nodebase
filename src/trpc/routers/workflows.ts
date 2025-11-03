import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

export const workflowsRouter = createTRPCRouter({
  findMany: protectedProcedure.query(() => prisma.workflow.findMany()),
  createOne: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/create.workflow",
      data: {
        email: "asd@asd.com",
      },
    });
    return { success: true, message: "Workflow creation triggered" };
  }),
});

export type WorkflowsRouter = typeof workflowsRouter;
