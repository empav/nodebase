import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { topologicalSort } from "./utils";
import { getExecutor } from "@/features/executions/ExecutorRegistry";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "workflows/execute.workflow" },
  async ({ event, step }) => {
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

    let context = event.data.initialData || {};

    // Exec each node
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
      });
    }

    return { workflowId: wId, result: context };
  },
);
