import prisma from "@/lib/prisma";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI();

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

export const executeAI = inngest.createFunction(
  { id: "execute-ai" },
  { event: "test/execute.ai" },
  async ({ step }) => {
    const { steps } = await step.ai.wrap("generate text", generateText, {
      model: google("gemini-2.5-flash"),
      prompt: "What's 2 + 2",
      system: "You are a helpful assistant",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });
    return steps;
  },
);
