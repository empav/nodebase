import { NodeType } from "@/generated/prisma/enums";
import { manualTriggerExecutor } from "@/features/executions/components/manual-trigger/Executor";
import { HttpRequestExecutor } from "./components/http-request/Executor";
import type { GetStepTools, Inngest } from "inngest";

export type WorkflowContext = Record<string, unknown>;

export type StepTools = GetStepTools<Inngest.Any>;

export type NodeExecutorParams<TData = Record<string, unknown>> = {
  data: TData;
  nodeId: string;
  context: WorkflowContext;
  step: StepTools;
};

export type NodeExecutor<TData = Record<string, unknown>> = (
  params: NodeExecutorParams<TData>,
) => Promise<WorkflowContext>;

const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: HttpRequestExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) throw new Error(`No executor found for node type: ${type}`);

  return executor;
};
