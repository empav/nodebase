"use client";

import { Position, type NodeProps } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { memo, type ReactNode } from "react";
import { WorkflowNode } from "@/components/react-flow/WorkflowNode";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/BaseNode";
import Image from "next/image";
import { BaseHandle } from "@/components/react-flow/BaseHandle";

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  //   status?: NodeStatus;
  showToolbar?: boolean;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

const BaseExecutionNode = memo(
  ({
    icon: Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,
    showToolbar = false,
  }: BaseExecutionNodeProps) => {
    //TODO: Implement delete
    const onDelete = () => {};

    return (
      <WorkflowNode
        name={name}
        onSettingsAction={onSettings}
        description={description}
        onDeleteAction={onDelete}
        showToolbar={showToolbar}
      >
        <BaseNode onDoubleClick={onDoubleClick}>
          <BaseNodeContent>
            {typeof Icon === "string" ? (
              <Image src={Icon} alt={name} width={16} height={16} />
            ) : (
              <Icon className="size-4 text-muted-foreground" />
            )}
            {children}
            <BaseHandle id="target-1" type="target" position={Position.Left} />
            <BaseHandle id="source-1" type="source" position={Position.Right} />
          </BaseNodeContent>
        </BaseNode>
      </WorkflowNode>
    );
  },
);

BaseExecutionNode.displayName = "BaseExecutionNode";

export default BaseExecutionNode;
