"use client";

import { Position, useReactFlow, type NodeProps } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { memo, type ReactNode } from "react";
import { WorkflowNode } from "@/components/react-flow/WorkflowNode";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/BaseNode";
import Image from "next/image";
import { BaseHandle } from "@/components/react-flow/BaseHandle";

interface BaseTriggerNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  //   status?: NodeStatus;
  showToolbar?: boolean;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

const BaseTriggerNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,
    showToolbar = false,
  }: BaseTriggerNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();

    const onDelete = () => {
      setNodes((currentNodes) => {
        return currentNodes.filter((cn) => cn.id !== id);
      });
      setEdges((currentEdges) => {
        return currentEdges.filter(
          (ce) => ce.source !== id && ce.target !== id,
        );
      });
    };

    return (
      <WorkflowNode
        name={name}
        onSettingsAction={onSettings}
        description={description}
        onDeleteAction={onDelete}
        showToolbar={showToolbar}
      >
        <BaseNode
          onDoubleClick={onDoubleClick}
          className="rounded-l-2xl relative group"
        >
          <BaseNodeContent>
            {typeof Icon === "string" ? (
              <Image src={Icon} alt={name} width={16} height={16} />
            ) : (
              <Icon className="size-4 text-muted-foreground" />
            )}
            {children}
            <BaseHandle id="source-1" type="source" position={Position.Right} />
          </BaseNodeContent>
        </BaseNode>
      </WorkflowNode>
    );
  },
);

BaseTriggerNode.displayName = "BaseTriggerNode";

export default BaseTriggerNode;
