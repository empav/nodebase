import prisma from "@/lib/prisma";
import { inngest } from "./client";

export const createWorkflow = inngest.createFunction(
  { id: "create-workflow" },
  { event: "test/create.workflow" },
  async ({ event, step }) => {
    await step.sleep("do stuff 1", "1s");
    await step.sleep("do stuff 2", "1s");
    await step.sleep("do stuff 3", "1s");

    return await step.run("create workflow", async () => {
      return await prisma.workflow.create({
        data: {
          name: event.data.email,
        },
      });
    });
  },
);
