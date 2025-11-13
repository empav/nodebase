"use client";

import { Position, useReactFlow, type NodeProps } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { memo, type ReactNode } from "react";
import { WorkflowNode } from "@/components/react-flow/WorkflowNode";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/BaseNode";
import Image from "next/image";
import { BaseHandle } from "@/components/react-flow/BaseHandle";
import {
  NodeStatusIndicator,
  type NodeStatus,
} from "@/components/react-flow/NodeStatusIndicator";

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  status?: NodeStatus;
  showToolbar?: boolean;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

const BaseExecutionNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,
    showToolbar = false,
    status = "initial",
  }: BaseExecutionNodeProps) => {
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
        <NodeStatusIndicator status={status} variant="border">
          <BaseNode status={status} onDoubleClick={onDoubleClick}>
            <BaseNodeContent>
              {typeof Icon === "string" ? (
                <Image src={Icon} alt={name} width={16} height={16} />
              ) : (
                <Icon className="size-4 text-muted-foreground" />
              )}
              {children}
              <BaseHandle
                id="target-1"
                type="target"
                position={Position.Left}
              />
              <BaseHandle
                id="source-1"
                type="source"
                position={Position.Right}
              />
            </BaseNodeContent>
          </BaseNode>
        </NodeStatusIndicator>
      </WorkflowNode>
    );
  },
);

BaseExecutionNode.displayName = "BaseExecutionNode";

export default BaseExecutionNode;
