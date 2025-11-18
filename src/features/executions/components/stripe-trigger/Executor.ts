import type { NodeStatus } from "@/components/react-flow/NodeStatusIndicator";
import type { NodeExecutor } from "@/features/executions/ExecutorRegistry";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";
import type { Realtime } from "@inngest/realtime";

type StripeTriggerData = Record<string, unknown>;

const publishStatus =
  (publish: Realtime.PublishFn) =>
  async (nodeId: string, status: NodeStatus) => {
    await publish(
      stripeTriggerChannel().status({
        nodeId,
        status,
      }),
    );
  };

export const stripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async ({
  nodeId,
  context,
  step,
  publish,
}) => {
  try {
    await publishStatus(publish)(nodeId, "loading");
    const trigger = await step.run("stripe-trigger", () => context);
    await publishStatus(publish)(nodeId, "success");
    return trigger;
  } catch (error) {
    await publishStatus(publish)(nodeId, "error");
    throw error;
  }
};
