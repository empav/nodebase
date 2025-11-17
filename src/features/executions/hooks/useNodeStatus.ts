import type { Realtime } from "@inngest/realtime";
import { useEffect, useState } from "react";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { NodeStatus } from "@/components/react-flow/NodeStatusIndicator";

type Props = {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
};

const useNodeStatus = ({
  nodeId,
  channel,
  topic,
  refreshToken,
}: Props): NodeStatus => {
  const [status, setStatus] = useState(NodeStatus.initial);

  const { data } = useInngestSubscription({ refreshToken, enabled: true });

  useEffect(() => {
    if (!data?.length) {
      return;
    }
    const latestMessage = data
      .filter(
        (m) =>
          m.kind === "data" &&
          m.channel === channel &&
          m.topic === topic &&
          m.data.nodeId === nodeId,
      )
      .sort((a, b) => {
        if (a.kind === "data" && b.kind === "data") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      })[0];

    if (latestMessage?.kind === "data") {
      setStatus(latestMessage.data.status);
    }
  }, [data, channel, topic, nodeId]);

  return status;
};

export default useNodeStatus;
