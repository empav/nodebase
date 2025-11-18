import { NodeType } from "@prisma/client";
import { manualTriggerExecutor } from "@/features/executions/components/manual-trigger/Executor";
import { httpRequestExecutor } from "./components/http-request/Executor";
import type { GetStepTools, Inngest } from "inngest";
import type { Realtime } from "@inngest/realtime";
import { googleFormTriggerExecutor } from "./components/google-form-trigger/Executor";
import { stripeTriggerExecutor } from "./components/stripe-trigger/Executor";

export type WorkflowContext = Record<string, unknown>;

export type StepTools = GetStepTools<Inngest.Any>;

export type NodeExecutorParams<TData = Record<string, unknown>> = {
  data: TData;
  nodeId: string;
  context: WorkflowContext;
  step: StepTools;
  publish: Realtime.PublishFn;
};

export type NodeExecutor<TData = Record<string, unknown>> = (
  params: NodeExecutorParams<TData>,
) => Promise<WorkflowContext>;

const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor as NodeExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) throw new Error(`No executor found for node type: ${type}`);

  return executor;
};
