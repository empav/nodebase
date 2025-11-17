"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseExecutionNode from "../BaseExecutionNode";
import { GlobeIcon } from "lucide-react";
import { type HttpRequestDialogFormValues, HttpRequestDialog } from "./Dialog";
import useNodeStatus from "../../hooks/useNodeStatus";
import { HTTP_REQUEST_CHANNEL_NAME } from "@/inngest/channels/http-request";
import { fetchHttpRequestRealtimeToken } from "./serverActions";

export type HttpRequestNodeData = HttpRequestDialogFormValues;

export const HttpRequestNode = memo(
  (props: NodeProps<Node<HttpRequestNodeData>>) => {
    const [open, setOpen] = useState(false);

    const { setNodes } = useReactFlow();

    const status = useNodeStatus({
      nodeId: props.id,
      channel: HTTP_REQUEST_CHANNEL_NAME,
      topic: "status",
      refreshToken: fetchHttpRequestRealtimeToken,
    });

    const description = props.data?.endpoint
      ? `${props.data.method || "GET"}: ${props.data.endpoint}`
      : "Not configured";

    const onSettings = () => setOpen(true);

    const onSubmit = (values: HttpRequestDialogFormValues) => {
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
        <HttpRequestDialog
          open={open}
          onOpenChange={setOpen}
          onSubmit={onSubmit}
          defaultValues={props.data}
        />
        <BaseExecutionNode
          {...props}
          icon={GlobeIcon}
          name="Http Request"
          description={description}
          onSettings={onSettings}
          onDoubleClick={onSettings}
          showToolbar
          status={status}
        />
      </>
    );
  },
);

HttpRequestNode.displayName = "HttpRequestNode";

export default HttpRequestNode;
