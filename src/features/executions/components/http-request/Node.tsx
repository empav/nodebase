"use client";

import type { Node, NodeProps } from "@xyflow/react";
import { memo } from "react";
import BaseExecutionNode from "../BaseExecutionNode";
import { GlobeIcon } from "lucide-react";

type HttpRequestNodeData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
  [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const description = props.data?.endpoint
    ? `${props.data.method || "GET"}: ${props.data.endpoint}`
    : "Not configured";

  return (
    <BaseExecutionNode
      {...props}
      icon={GlobeIcon}
      name="Http Request"
      description={description}
      onSettings={() => {}}
      onDoubleClick={() => {}}
      showToolbar
    />
  );
});

HttpRequestNode.displayName = "HttpRequestNode";

export default HttpRequestNode;
