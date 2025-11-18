"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseExecutionNode from "../BaseExecutionNode";
import { type GeminiDialogFormValues, GeminiDialog } from "./Dialog";
import useNodeStatus from "../../hooks/useNodeStatus";
import { fetchGeminiRealtimeToken } from "./serverActions";
import { GEMINI_CHANNEL_NAME } from "@/inngest/channels/gemini";
import { GEMINI_MODELS } from "@/config/constants";

export type GeminiNodeData = GeminiDialogFormValues;

export const GeminiNode = memo((props: NodeProps<Node<GeminiNodeData>>) => {
  const [open, setOpen] = useState(false);

  const { setNodes } = useReactFlow();

  const status = useNodeStatus({
    nodeId: props.id,
    channel: GEMINI_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchGeminiRealtimeToken,
  });

  const description = props.data?.userPrompt
    ? `${props.data.model || GEMINI_MODELS[0]}: ${props.data.userPrompt.slice(0, 50)}...`
    : "Not configured";

  const onSettings = () => setOpen(true);

  const onSubmit = (values: GeminiDialogFormValues) => {
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
      <GeminiDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={onSubmit}
        defaultValues={props.data}
      />
      <BaseExecutionNode
        {...props}
        icon="/logos/gemini.svg"
        name="Gemini"
        description={description}
        onSettings={onSettings}
        onDoubleClick={onSettings}
        showToolbar
        status={status}
      />
    </>
  );
});

GeminiNode.displayName = "GeminiNode";

export default GeminiNode;
