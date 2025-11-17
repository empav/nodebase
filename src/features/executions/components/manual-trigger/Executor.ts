import type { NodeStatus } from "@/components/react-flow/NodeStatusIndicator";
import type { NodeExecutor } from "@/features/executions/ExecutorRegistry";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import type { Realtime } from "@inngest/realtime";

type ManualTriggerData = Record<string, unknown>;

const publishStatus =
  (publish: Realtime.PublishFn) =>
  async (nodeId: string, status: NodeStatus) => {
    await publish(
      manualTriggerChannel().status({
        nodeId,
        status,
      }),
    );
  };

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  context,
  step,
  publish,
}) => {
  try {
    await publishStatus(publish)(nodeId, "loading");
    const trigger = await step.run("manual-trigger", () => context);
    await publishStatus(publish)(nodeId, "success");
    return trigger;
  } catch (error) {
    await publishStatus(publish)(nodeId, "error");
    throw error;
  }
};
