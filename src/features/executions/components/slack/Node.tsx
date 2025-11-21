"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseExecutionNode from "../BaseExecutionNode";
import { type SlackDialogFormValues, SlackDialog } from "./Dialog";
import useNodeStatus from "../../hooks/useNodeStatus";
import { fetchSlackRealtimeToken } from "./serverActions";
import { SLACK_CHANNEL_NAME } from "@/inngest/channels/slack";

export type SlackNodeData = SlackDialogFormValues;

export const SlackNode = memo((props: NodeProps<Node<SlackNodeData>>) => {
  const [open, setOpen] = useState(false);

  const { setNodes } = useReactFlow();

  const status = useNodeStatus({
    nodeId: props.id,
    channel: SLACK_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchSlackRealtimeToken,
  });

  const description = props.data?.content
    ? `${props.data.content.slice(0, 50)}`
    : "Not configured";

  const onSettings = () => setOpen(true);

  const onSubmit = (values: SlackDialogFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
  };

  return (
    <>
      <SlackDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={onSubmit}
        defaultValues={props.data}
      />
      <BaseExecutionNode
        {...props}
        icon="/logos/slack.svg"
        name="Slack"
        description={description}
        onSettings={onSettings}
        onDoubleClick={onSettings}
        showToolbar
        status={status}
      />
    </>
  );
});

SlackNode.displayName = "SlackNode";

export default SlackNode;
