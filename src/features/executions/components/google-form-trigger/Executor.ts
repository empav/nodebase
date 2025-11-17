import type { NodeStatus } from "@/components/react-flow/NodeStatusIndicator";
import type { NodeExecutor } from "@/features/executions/ExecutorRegistry";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
import type { Realtime } from "@inngest/realtime";

type GoogleFormTriggerData = Record<string, unknown>;

const publishStatus =
  (publish: Realtime.PublishFn) =>
  async (nodeId: string, status: NodeStatus) => {
    await publish(
      googleFormTriggerChannel().status({
        nodeId,
        status,
      }),
    );
  };

export const googleFormTriggerExecutor: NodeExecutor<
  GoogleFormTriggerData
> = async ({ nodeId, context, step, publish }) => {
  try {
    await publishStatus(publish)(nodeId, "loading");
    const trigger = await step.run("google-form-trigger", () => context);
    await publishStatus(publish)(nodeId, "success");
    return trigger;
  } catch (error) {
    await publishStatus(publish)(nodeId, "error");
    throw error;
  }
};
