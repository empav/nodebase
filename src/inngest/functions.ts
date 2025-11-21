import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { topologicalSort } from "./utils";
import { getExecutor } from "@/features/executions/ExecutorRegistry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { geminiRequestChannel } from "./channels/gemini";
import { slackRequestChannel } from "./channels/slack";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow", retries: 0 },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiRequestChannel(),
      slackRequestChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const wId = event.data.workflowId;
    if (!wId) throw new NonRetriableError("WorkflowId is missing");

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const ws = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: wId,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });
      return topologicalSort(ws.nodes, ws.connections);
    });

    const { userId } = await step.run("get-userid", async () => {
      return await prisma.workflow.findUniqueOrThrow({
        where: { id: wId },
        select: { userId: true },
      });
    });

    let context = event.data.initialData || {};

    // Exec each node
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        userId,
        context,
        step,
        publish,
      });
    }

    return { workflowId: wId, result: context };
  },
);
