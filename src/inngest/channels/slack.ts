import type { NodeStatus } from "@/components/react-flow/NodeStatusIndicator";
import { channel, topic } from "@inngest/realtime";

export const SLACK_CHANNEL_NAME = "slack-execution";

export const slackRequestChannel = channel(SLACK_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: NodeStatus;
  }>(),
);
