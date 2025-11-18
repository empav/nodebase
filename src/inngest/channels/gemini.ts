import type { NodeStatus } from "@/components/react-flow/NodeStatusIndicator";
import { channel, topic } from "@inngest/realtime";

export const GEMINI_CHANNEL_NAME = "gemini-execution";

export const geminiRequestChannel = channel(GEMINI_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: NodeStatus;
  }>(),
);
