import type { NodeExecutor } from "@/features/executions/ExecutorRegistry";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  context,
  step,
}) => {
  // TODO: Showing loading node state
  return await step.run("manual-trigger", () => context);
  // TODO: Showing success node state
};
